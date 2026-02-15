"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    const err = await register(email, password, name);
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
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-cream/70 text-sm mb-1">
              Name
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
            <label
              htmlFor="email"
              className="block text-cream/70 text-sm mb-1"
            >
              Email *
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
              Password *
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
              Confirm Password *
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
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-cream/50 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
