"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function BuyCourseButton({
  slug,
  priceEur,
  className = "",
}: {
  slug: string;
  priceEur: number;
  className?: string;
}) {
  const { user, loading } = useAuth();
  const { t, locale } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const base =
    "inline-flex items-center justify-center min-h-[52px] rounded-full bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3 text-[17px] transition-colors disabled:opacity-60";
  const price = `€${priceEur % 1 === 0 ? priceEur : priceEur.toFixed(2)}`;

  if (!loading && !user) {
    return (
      <Link href={`/login?next=${encodeURIComponent(`/courses/${slug}`)}`} className={`${base} ${className}`}>
        {t.courses.loginToBuy} · {price}
      </Link>
    );
  }

  const buy = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/courses/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(t.courses.error);
    } catch {
      setError(t.courses.error);
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <button type="button" onClick={buy} disabled={busy || loading} className={`${base} ${className}`}>
        {busy ? t.courses.redirecting : `${t.courses.buyFor} ${price}`}
      </button>
      {error && <p className="text-[#ff9b8a] text-sm" role="alert">{error}</p>}
    </div>
  );
}
