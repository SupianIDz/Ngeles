import Fastify from "fastify";
import staticPlugin from "@fastify/static";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PassThrough } from "node:stream";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const DATA = join(ROOT, "data");

const isDev = process.env["NODE_ENV"] !== "production";
const PORT = Number(process.env["PORT"] ?? 3000);
const HOST = process.env["HOST"] ?? "127.0.0.1";

const app = Fastify({ logger: { level: isDev ? "info" : "warn" } });

// ── Static files (production build) ──────────────────────────────────────────
if (!isDev) {
  if (!existsSync(DIST)) {
    console.error(`[ngeles] dist/ not found. Run "npm run build" first.`);
    process.exit(1);
  }

  await app.register(staticPlugin, {
    root: DIST,
    prefix: "/",
    decorateReply: false,
  });

  // Serve data JSON for the client (fetched on-demand)
  await app.register(staticPlugin, {
    root: DATA,
    prefix: "/data/",
    decorateReply: false,
  });
}

// ── API: GET /api/excuses/:lang/:context ──────────────────────────────────────

let VALID_LANGS = new Set<string>();
let VALID_CONTEXTS_BY_LANG = new Map<string, Set<string>>();

try {
  const manifestRaw = await readFile(join(DATA, "manifest.json"), "utf-8");
  const manifest = JSON.parse(manifestRaw);
  manifest.languages.forEach((langObj: any) => {
    VALID_LANGS.add(langObj.id);
    const topics = new Set<string>(langObj.topics.map((t: any) => t.id));
    VALID_CONTEXTS_BY_LANG.set(langObj.id, topics);
  });
} catch (e) {
  console.error("Failed to load manifest.json", e);
  process.exit(1);
}

interface ExcuseParams {
  lang: string;
  context: string;
}

app.get<{ Params: ExcuseParams }>("/api/excuses/:lang/:context", async (req, reply) => {
  const { lang, context } = req.params;

  if (!VALID_LANGS.has(lang)) {
    return reply.code(400).send({ error: `Invalid lang: ${lang}. Use 'en' or 'id'.` });
  }
  const validContexts = VALID_CONTEXTS_BY_LANG.get(lang);
  if (!validContexts || !validContexts.has(context)) {
    return reply
      .code(400)
      .send({ error: `Invalid context: ${context} for lang: ${lang}.` });
  }

  const filePath = join(DATA, lang, `${context}.json`);

  try {
    const raw = await readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(raw);
    return reply.code(200).type("application/json").send(data);
  } catch {
    return reply.code(404).send({ error: "Excuse file not found." });
  }
});

// ── API: GET /api/excuses/:lang/:context/random?level=normal ──────────────────

interface RandomQuery {
  level?: string;
  targetName?: string;
  generatorName?: string;
}

app.get<{ Params: ExcuseParams; Querystring: RandomQuery }>(
  "/api/excuses/:lang/:context/random",
  async (req, reply) => {
    const { lang, context } = req.params;
    const { level = "normal", targetName = "", generatorName = "" } = req.query;

    if (!VALID_LANGS.has(lang)) {
      return reply.code(400).send({ error: `Invalid lang: ${lang}.` });
    }
    const validContexts = VALID_CONTEXTS_BY_LANG.get(lang);
    if (!validContexts || !validContexts.has(context)) {
      return reply.code(400).send({ error: `Invalid context: ${context} for lang: ${lang}.` });
    }

    const VALID_LEVELS = new Set(["normal", "ridiculous", "realityBending"]);
    if (!VALID_LEVELS.has(level)) {
      return reply.code(400).send({ error: `Invalid level: ${level}.` });
    }

    const filePath = join(DATA, lang, `${context}.json`);

    try {
      const raw = await readFile(filePath, "utf-8");
      const data = JSON.parse(raw) as {
        levels: Record<string, string[]>;
      };

      const pool = data.levels[level];
      if (!pool || pool.length === 0) {
        return reply.code(404).send({ error: "No excuses for that level." });
      }

      const template = pool[Math.floor(Math.random() * pool.length)]!;
      const FALLBACKS: Record<string, Record<string, string>> = {
        en: { work: "there", family: "everyone", social: "guys" },
        id: { work: "Pak/Bu", family: "semuanya", social: "guys" },
      };

      const cleanTarget = targetName.trim().replace(/\s+/g, " ");
      const targetReplacement = cleanTarget || (FALLBACKS[lang]?.[context] ?? "");
      
      const cleanGenerator = generatorName.trim().replace(/\s+/g, " ");
      const generatorReplacement = cleanGenerator || (lang === "id" ? "saya" : "I");

      const excuse = template
        .replace(/\[TARGET\]/g, targetReplacement)
        .replace(/\[NAME\]/g, generatorReplacement)
        .replace(/Pak\/Bu Pak\/Bu/g, "Pak/Bu")
        .replace(/\s+,/g, ",")
        .trim();

      return reply.code(200).send({ lang, context, level, excuse });
    } catch {
      return reply.code(500).send({ error: "Failed to load excuse file." });
    }
  },
);

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/api/health", async (_req, reply) => {
  return reply.send({ status: "ok", ts: new Date().toISOString() });
});

// ── Database (bun:sqlite) ───────────────────────────────────────────────────

import { Database } from "bun:sqlite";

const DB_PATH = join(DATA, "ngeles.sqlite");
const db = new Database(DB_PATH, { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS histories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    context TEXT NOT NULL,
    level TEXT NOT NULL,
    lang TEXT NOT NULL,
    generator_name TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS stats (
    key TEXT PRIMARY KEY,
    value INTEGER NOT NULL
  );
  INSERT OR IGNORE INTO stats (key, value) VALUES ('generated', 0);
`);

function censorName(name?: string): string {
  if (!name || name.trim() === "") return "Anonim";
  const trimmed = name.trim();
  if (trimmed.length <= 2) return trimmed[0] + "*";
  return trimmed[0] + "*".repeat(trimmed.length - 2) + trimmed[trimmed.length - 1];
}

interface PostHistoryBody {
  text: string;
  context: string;
  level: string;
  lang: string;
  name?: string;
}

app.post<{ Body: PostHistoryBody }>("/api/history", async (req, reply) => {
  const { text, context, level, lang, name } = req.body;
  if (!text || !context || !level || !lang) {
    return reply.code(400).send({ error: "Missing required fields" });
  }

  const censoredName = censorName(name);
  const ts = Date.now();

  const stmt = db.prepare(
    "INSERT INTO histories (text, context, level, lang, generator_name, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  );
  stmt.run(text, context, level, lang, censoredName, ts);

  // Keep only the 15 most recent records
  db.exec(`
    DELETE FROM histories WHERE id NOT IN (
      SELECT id FROM histories ORDER BY created_at DESC LIMIT 15
    )
  `);

  // Increment global stats
  db.exec("UPDATE stats SET value = value + 1 WHERE key = 'generated'");
  
  const statsRow = db.query<{value: number}, []>("SELECT value FROM stats WHERE key = 'generated'").get();
  const count = statsRow?.value || 0;

  // Broadcast updates
  const historyRows = db.prepare("SELECT * FROM histories ORDER BY created_at DESC LIMIT 15").all();
  broadcastSSE("history", historyRows);
  broadcastSSE("stats", { count });

  return reply.code(201).send({ success: true, count });
});

// ── SSE (Server-Sent Events) ────────────────────────────────────────────────

const sseClients = new Set<PassThrough>();

function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

app.get("/api/events", (req, reply) => {
  reply.raw.setHeader("Content-Type", "text/event-stream");
  reply.raw.setHeader("Cache-Control", "no-cache");
  reply.raw.setHeader("Connection", "keep-alive");

  const stream = new PassThrough();
  reply.send(stream);

  sseClients.add(stream);

  req.raw.on("close", () => {
    sseClients.delete(stream);
  });
});

app.get("/api/history", async (_req, reply) => {
  const stmt = db.prepare("SELECT * FROM histories ORDER BY created_at DESC LIMIT 15");
  const rows = stmt.all();
  return reply.code(200).send(rows);
});

app.get("/api/stats", async (_req, reply) => {
  const row = db.query<{value: number}, []>("SELECT value FROM stats WHERE key = 'generated'").get();
  return reply.code(200).send({ count: row?.value || 0 });
});

// ── Fallback SPA route (production) ──────────────────────────────────────────

if (!isDev) {
  app.setNotFoundHandler(async (_req, reply) => {
    try {
      const html = await readFile(join(DIST, "index.html"), "utf-8");
      return reply.code(200).type("text/html").send(html);
    } catch {
      return reply.code(404).send("Not found");
    }
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────

try {
  await app.listen({ port: PORT, host: HOST });
  console.info(`[ngeles] Server running → http://${HOST}:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
