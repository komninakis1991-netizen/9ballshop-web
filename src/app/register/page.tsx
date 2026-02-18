"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.register.passwordsMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.register.passwordTooShort);
      return;
    }

    setSubmitting(true);
    const err = await register(email, password, name, phone);
    setSubmitting(false);

    if (err) {
      setError(err);
    } else {
      router.push("/account");
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl text-gold text-center mb-8">
          {t.register.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-cream/70 text-sm mb-1">
              {t.register.name}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-cream/70 text-sm mb-1">
              {t.register.phone}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              placeholder="+30 694 123 4567"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.register.email}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.register.password}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.register.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-navy font-heading font-bold py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {submitting ? t.register.submitting : t.register.submit}
          </button>
        </form>

        <p className="text-center text-cream/50 text-sm mt-6">
          {t.register.hasAccount}{" "}
          <Link href="/login" className="text-gold hover:underline">
            {t.register.logIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
