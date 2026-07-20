export type Lang = string;
export type Context = string;
export type Level = "normal" | "ridiculous" | "realityBending";

export interface ExcuseFile {
  meta: { lang: Lang; context: Context; title: string };
  levels: Record<Level, string[]>;
}

export interface HistoryEntry {
  id: number;
  text: string;
  context: Context;
  level: Level;
  lang: Lang;
  created_at: number;
}

export interface AppState {
  lang: Lang;
  context: Context;
  level: Level;
  name: string;
  currentExcuse: string;
  generatedCount: number;
  history: HistoryEntry[];
}
