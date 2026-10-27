"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const authLink = loading ? null : user ? (
    <Link
      href="/account"
      className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap"
    >
      {t.nav.account}
    </Link>
  ) : (
    <Link
      href="/login"
      className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap"
    >
      {t.nav.login}
    </Link>
  );

  const mobileAuthLink = loading ? null : user ? (
    <Link
      href="/account"
      onClick={() => setMobileOpen(false)}
      className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium"
    >
      {t.nav.account}
    </Link>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium"
    >
      {t.nav.login}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/85 backdrop-blur-md border-b border-line">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading font-black uppercase text-[26px] leading-none tracking-[0.04em] text-cream flex-shrink-0">
            Marios<span className="text-gold">·</span>K
          </Link>

          {/* Desktop nav links */}
          <div className="hidden min-[1380px]:flex items-center gap-[18px] mx-6">
            <Link href="/tournaments" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.tournaments}
            </Link>
            <Link href="/lessons" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.lessons}
            </Link>
            <Link href="/courses" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.courses}
            </Link>
            <Link href="/videos" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.videos}
            </Link>
            <Link href="/blog" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.blog}
            </Link>
            <Link href="/about" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.about}
            </Link>
            <Link href="/collaborate" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.collaborate}
            </Link>
            <Link href="/custom-jerseys" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.customJerseys}
            </Link>
            <Link href="/members" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.members}
            </Link>
            <Link href="/community/forum.html" className="text-cream/80 hover:text-gold transition-colors text-[14px] font-medium whitespace-nowrap">
              {t.nav.community}
            </Link>
            {authLink}
            {!loading && user?.isAdmin && (
              <Link
                href="/admin"
                className="text-gold hover:text-gold-light transition-colors text-[14px] font-bold whitespace-nowrap"
              >
                {t.nav.admin}
              </Link>
            )}
          </div>

          {/* Language toggle + mobile hamburger — always visible */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              href="/lessons"
              className="hidden sm:inline-flex items-center min-h-[44px] rounded-full bg-gold hover:bg-gold-light text-navy font-bold px-5 text-[15px] whitespace-nowrap transition-colors"
            >
              {t.home.bookLesson}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-[1380px]:hidden text-cream p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="min-[1380px]:hidden bg-navy-light border-t border-line">
          <div className="px-4 py-4 space-y-1">
            <Link href="/tournaments" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.tournaments}
            </Link>
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.lessons}
            </Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.courses}
            </Link>
            <Link href="/videos" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.videos}
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.blog}
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.about}
            </Link>
            <Link href="/collaborate" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.collaborate}
            </Link>
            <Link href="/custom-jerseys" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.customJerseys}
            </Link>
            <Link href="/members" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.members}
            </Link>
            <Link href="/community/forum.html" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-[15px] font-medium">
              {t.nav.community}
            </Link>
            {mobileAuthLink}
            {!loading && user?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gold hover:text-gold-light transition-colors text-[14px] font-bold whitespace-nowrap"
              >
                {t.nav.admin}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
