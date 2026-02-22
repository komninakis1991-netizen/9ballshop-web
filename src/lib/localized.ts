import type { Locale } from "@/lib/i18n";

/** Return the Greek value when locale is "el" and it's non-empty, otherwise English. */
export function localized(locale: Locale, en: string, el: string): string {
  return locale === "el" && el ? el : en;
}
