import type { HistoryEntry, Lang } from "./types";

const KEYS = {
  history: "nm_history",
  count: "nm_count",
  lang: "nm_lang",
  visited: "nm_visited",
} as const;

const MAX_HISTORY = 15;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.history);
    if (!raw) return [];
    return (JSON.parse(raw) as HistoryEntry[]).slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(KEYS.history, JSON.stringify(entries.slice(0, MAX_HISTORY)));
}

export function pushHistory(entry: HistoryEntry, existing: HistoryEntry[]): HistoryEntry[] {
  const next = [entry, ...existing].slice(0, MAX_HISTORY);
  saveHistory(next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  localStorage.removeItem(KEYS.history);
  return [];
}

export function loadLang(): Lang {
  const stored = localStorage.getItem(KEYS.lang);
  return stored === "en" || stored === "id" ? stored : "en";
}

export function saveLang(lang: Lang): void {
  localStorage.setItem(KEYS.lang, lang);
}

export function isFirstVisit(): boolean {
  return !localStorage.getItem(KEYS.visited);
}

export function markVisited(): void {
  localStorage.setItem(KEYS.visited, "1");
}
