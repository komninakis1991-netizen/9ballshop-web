"use client";

import { useState, FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface NewsletterFormProps {
  variant: "full" | "compact";
}

export default function NewsletterForm({ variant }: NewsletterFormProps) {
  const { t, locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg(t.newsletter.invalidEmail);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "invalid_email") {
          setErrorMsg(t.newsletter.invalidEmail);
        } else {
          setErrorMsg(t.newsletter.errorMessage);
        }
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg(t.newsletter.errorMessage);
      setStatus("error");
    }
  }

  if (variant === "full") {
    return (
      <section className="bg-navy-light py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">{t.home.newsletterSubtitle}</p>
          <h2 className="font-heading text-3xl text-cream mb-4">{t.home.newsletterTitle}</h2>
          <p className="text-cream/50 mb-8">{t.home.newsletterDescription}</p>

          {status === "success" ? (
            <div className="space-y-4">
              <p className="text-gold font-semibold">{t.newsletter.successMessage}</p>
              <a
                href="/downloads/9ballshop-billiards-guide.pdf"
                download
                className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
              >
                {t.newsletter.downloadButton}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.home.newsletterPlaceholder}
                className="flex-1 bg-navy border border-gold/20 rounded px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 text-sm"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider whitespace-nowrap disabled:opacity-50"
              >
                {status === "submitting" ? t.newsletter.submitting : t.home.subscribe}
              </button>
            </form>
          )}

          {errorMsg && (
            <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
          )}
        </div>
      </section>
    );
  }

  // compact variant for footer
  return (
    <div className="mb-6">
      <h4 className="text-cream font-semibold mb-2 text-sm uppercase tracking-wider">{t.newsletter.footerTitle}</h4>
      <p className="text-cream/50 text-sm mb-3">{t.newsletter.footerDescription}</p>

      {status === "success" ? (
        <div className="space-y-2">
          <p className="text-gold text-sm font-semibold">{t.newsletter.successMessage}</p>
          <a
            href="/downloads/9ballshop-billiards-guide.pdf"
            download
            className="inline-block bg-gold hover:bg-gold-light text-navy font-semibold px-4 py-2 rounded transition-colors text-xs uppercase tracking-wider"
          >
            {t.newsletter.downloadButton}
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.home.newsletterPlaceholder}
            className="flex-1 bg-navy border border-gold/20 rounded px-3 py-2 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 text-sm"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-4 py-2 rounded transition-colors text-xs uppercase tracking-wider whitespace-nowrap disabled:opacity-50"
          >
            {status === "submitting" ? t.newsletter.submitting : t.home.subscribe}
          </button>
        </form>
      )}

      {errorMsg && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
