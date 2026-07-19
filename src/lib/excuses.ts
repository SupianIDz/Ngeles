import type { Lang, Context, Level, ExcuseFile } from "./types";

// Vite's import.meta.glob — resolved at build time into lazy-loaded modules
const modules = import.meta.glob<{ default: ExcuseFile }>("/data/**/*.json", { eager: false });

const cache = new Map<string, ExcuseFile>();

export async function loadExcuses(lang: Lang, context: Context): Promise<ExcuseFile> {
  const key = `${lang}/${context}`;
  if (cache.has(key)) return cache.get(key)!;

  const path = `/data/${lang}/${context}.json`;
  const loader = modules[path];
  if (!loader) throw new Error(`Excuse file not found: ${path}`);

  const mod = await loader();
  const data = mod.default;
  cache.set(key, data);
  return data;
}

export async function pickExcuse(
  lang: Lang,
  context: Context,
  level: Level,
  targetName: string,
  generatorName: string = "",
): Promise<string> {
  const data = await loadExcuses(lang, context);
  const pool = data.levels[level];
  if (!pool || pool.length === 0) throw new Error("No excuses in pool");

  const raw = pool[Math.floor(Math.random() * pool.length)]!;
  return applyName(raw, targetName, generatorName, context, lang);
}

function fallbackName(context: Context, lang: Lang): string {
  if (lang === "id") {
    return context === "work" ? "Pak/Bu" : context === "family" ? "semuanya" : "guys";
  }
  return context === "work" ? "there" : context === "family" ? "everyone" : "guys";
}

export function applyName(
  template: string,
  targetName: string,
  generatorName: string,
  context: Context,
  lang: Lang = "id",
): string {
  const cleanTarget = targetName.trim().replace(/\s+/g, " ");
  const targetReplacement = cleanTarget || fallbackName(context, lang);
  
  const cleanGenerator = generatorName.trim().replace(/\s+/g, " ");
  const generatorReplacement = cleanGenerator || (lang === "id" ? "saya" : "I");

  return template
    .replace(/\[TARGET\]/g, targetReplacement)
    .replace(/\[NAME\]/g, generatorReplacement)
    .replace(/Pak\/Bu Pak\/Bu/g, "Pak/Bu")
    .replace(/bos Pak\/Bu/g, "bos")
    .replace(/guys guys/g, "guys")
    .replace(/everyone everyone/g, "everyone")
    .replace(/\s+,/g, ",")
    .trim();
}

/** Warm the cache for a given lang (preload all 3 contexts) */
export async function preloadLang(lang: Lang, contexts: Context[]): Promise<void> {
  await Promise.all(contexts.map(ctx => loadExcuses(lang, ctx)));
}

export function getTopicTitle(lang: Lang, context: Context, _dep?: number): string {
  const key = `${lang}/${context}`;
  const data = cache.get(key);
  return data?.meta?.title || context;
}
