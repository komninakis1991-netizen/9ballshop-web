"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LocaleDate({
  date,
  options,
}: {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const { locale } = useLanguage();
  const d = typeof date === "string" ? new Date(date) : date;
  const localeTag = locale === "el" ? "el-GR" : "en-US";
  const opts = options ?? { year: "numeric", month: "long", day: "numeric" };
  return <>{d.toLocaleDateString(localeTag, opts)}</>;
}
