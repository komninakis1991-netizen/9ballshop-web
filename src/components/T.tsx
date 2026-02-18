"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { Dictionary } from "@/lib/i18n";

type DotPath<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : T extends readonly string[]
    ? Prefix
    : {
        [K in keyof T & string]: DotPath<
          T[K],
          Prefix extends "" ? K : `${Prefix}.${K}`
        >;
      }[keyof T & string];

function getByPath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export default function T({ k }: { k: DotPath<Dictionary> }) {
  const { t } = useLanguage();
  return <>{getByPath(t as unknown as Record<string, unknown>, k)}</>;
}
