import en from "./en";
import el from "./el";

export type Locale = "en" | "el";
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, el };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
