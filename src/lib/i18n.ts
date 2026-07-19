import type { Lang, Context, Level } from "./types";
import en from "../locales/en.json";
import id from "../locales/id.json";

export interface Translations {
  appTagline: string;
  appSubtitle: string;
  buildHeading: string;
  buildSubheading: string;
  labelGeneratorName: string;
  labelTargetName: string;
  labelNameOptional: string;
  labelGeneratorPlaceholder: string;
  labelTargetPlaceholder: string;
  labelContext: string;
  labelLevel: string;
  levelNormal: string;
  levelRidiculous: string;
  levelRealityBending: string;
  btnGenerate: string;
  btnSurprise: string;
  btnCopy: string;
  btnCopied: string;
  btnRegenerate: string;
  btnSave: string;
  btnSaved: string;
  resultLabel: string;
  historyHeading: string;
  historyClear: string;
  historyEmpty: string;
  historyEmptyHint: string;
  toastCopied: string;
  toastSaved: string;
  toastExcuseCopied: string;
  confirmClear: string;
  searchPlaceholder: string;
  badgeSafe: string;
  badgeRidiculous: string;
  badgeRealityBending: string;
  footerNote: string;
  langToggleLabel: string;
  generatedStat: string;
  btnWhatsApp: string;
  loadingTexts: string[];
}

const dict: Record<string, Translations> = { en, id };

export function t(lang: string, key: keyof Translations): string {
  const dictionary = dict[lang] || dict["en"];
  return dictionary![key];
}

export function levelLabel(lang: string, level: Level): string {
  const map: Record<Level, keyof Translations> = {
    normal: "badgeSafe",
    ridiculous: "badgeRidiculous",
    realityBending: "badgeRealityBending",
  };
  return t(lang, map[level]);
}

export const LEVELS: Level[] = ["normal", "ridiculous", "realityBending"];
