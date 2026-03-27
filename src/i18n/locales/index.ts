import th from "./th";
import en from "./en";
import zh from "./zh";
import ja from "./ja";

export type Locale = "th" | "en" | "zh" | "ja";

export const locales: Locale[] = ["th", "en", "zh", "ja"];

export const dictionaries: Record<Locale, Record<string, string>> = {
  th,
  en,
  zh,
  ja,
};

export function getDictionary(locale: Locale): Record<string, string> {
  return dictionaries[locale] ?? dictionaries.th;
}
