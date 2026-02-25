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
      className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.account}
    </Link>
  ) : (
    <Link
      href="/login"
      className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.login}
    </Link>
  );

  const mobileAuthLink = loading ? null : user ? (
    <Link
      href="/account"
      onClick={() => setMobileOpen(false)}
      className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.account}
    </Link>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.login}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading text-2xl font-bold text-gold tracking-wider flex-shrink-0">
            9BALLSHOP
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/tournaments" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.tournaments}
            </Link>
            <Link href="/lessons" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.lessons}
            </Link>
            <Link href="/videos" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.videos}
            </Link>
            <Link href="/blog" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.blog}
            </Link>
            <Link href="/about" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.about}
            </Link>
            <Link href="/collaborate" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.collaborate}
            </Link>
            <Link href="/custom-jerseys" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.customJerseys}
            </Link>
            <Link href="/members" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.members}
            </Link>
            {authLink}
            {!loading && user?.isAdmin && (
              <Link
                href="/admin"
                className="text-gold hover:text-gold-light transition-colors text-sm uppercase tracking-widest font-semibold"
              >
                {t.nav.admin}
              </Link>
            )}
          </div>

          {/* Language toggle + mobile hamburger — always visible */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-cream p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
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
        <div className="lg:hidden bg-navy-light border-t border-gold/10">
          <div className="px-4 py-4 space-y-1">
            <Link href="/tournaments" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.tournaments}
            </Link>
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.lessons}
            </Link>
            <Link href="/videos" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.videos}
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.blog}
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.about}
            </Link>
            <Link href="/collaborate" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.collaborate}
            </Link>
            <Link href="/custom-jerseys" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.customJerseys}
            </Link>
            <Link href="/members" onClick={() => setMobileOpen(false)} className="block py-3 text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.members}
            </Link>
            {mobileAuthLink}
            {!loading && user?.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gold hover:text-gold-light transition-colors text-sm uppercase tracking-widest font-semibold"
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
