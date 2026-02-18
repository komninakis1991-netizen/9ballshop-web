"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const { t } = useLanguage();

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
      className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.account}
    </Link>
  ) : (
    <Link
      href="/login"
      onClick={() => setMobileOpen(false)}
      className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
    >
      {t.nav.login}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-heading text-2xl font-bold text-gold tracking-wider">
            9BALLSHOP
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.shop}
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
            <Link
              href="/cart"
              className="relative text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest"
            >
              {t.nav.cart}
            </Link>
            {authLink}
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <LanguageToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-cream p-2"
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
        <div className="md:hidden bg-navy-light border-t border-gold/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="/shop" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.shop}
            </Link>
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.lessons}
            </Link>
            <Link href="/videos" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.videos}
            </Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.blog}
            </Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.about}
            </Link>
            <Link href="/collaborate" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.collaborate}
            </Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)} className="block text-cream/80 hover:text-gold transition-colors text-sm uppercase tracking-widest">
              {t.nav.cart}
            </Link>
            {mobileAuthLink}
          </div>
        </div>
      )}
    </nav>
  );
}
