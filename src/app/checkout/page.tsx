"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  brand: string;
  quantity: number;
}

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("9ballshop-cart");
  return raw ? JSON.parse(raw) : [];
}

function calculateShipping(postalCode: string): number {
  const trimmed = postalCode.trim();
  if (trimmed.length === 5 && trimmed.startsWith("1")) {
    return 4; // Athens/Attica
  }
  return 12; // Rest of Greece
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Shipping form fields
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingStreet, setShippingStreet] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const shippingCountry = "GR";

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    setCart(items);
    setMounted(true);
  }, [router]);

  // Pre-fill from user profile when auth loads
  useEffect(() => {
    if (!authLoading && user) {
      setShippingName((prev) => prev || user.name || "");
      setShippingPhone((prev) => prev || user.phone || "");
      setShippingStreet((prev) => prev || user.addressStreet || "");
      setShippingCity((prev) => prev || user.addressCity || "");
      setShippingPostalCode((prev) => prev || user.addressPostalCode || "");
    }
  }, [authLoading, user]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost =
    shippingPostalCode.trim().length === 5
      ? calculateShipping(shippingPostalCode)
      : null;
  const total = shippingCost !== null ? subtotal + shippingCost : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (shippingPostalCode.trim().length !== 5) {
      setError(t.checkout.invalidPostalCode);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            currency: item.currency,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: shippingName,
            phone: shippingPhone,
            street: shippingStreet,
            city: shippingCity,
            postalCode: shippingPostalCode.trim(),
            country: shippingCountry,
          },
          shippingCost: calculateShipping(shippingPostalCode),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || t.checkout.checkoutFailed);
        setSubmitting(false);
      }
    } catch {
      setError(t.checkout.checkoutFailed);
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-navy min-h-screen flex items-center justify-center">
        <p className="text-cream/40">{t.checkout.loading}</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-navy-light border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40";

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">
            {t.checkout.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">
            {t.checkout.title}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div>
              <h2 className="font-heading text-xl text-gold mb-6">
                {t.checkout.shippingAddress}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="shippingName"
                    className="block text-cream/70 text-sm mb-1"
                  >
                    {t.checkout.fullName}
                  </label>
                  <input
                    id="shippingName"
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingPhone"
                    className="block text-cream/70 text-sm mb-1"
                  >
                    {t.checkout.phone}
                  </label>
                  <input
                    id="shippingPhone"
                    type="tel"
                    required
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+30 694 123 4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingStreet"
                    className="block text-cream/70 text-sm mb-1"
                  >
                    {t.checkout.streetAddress}
                  </label>
                  <input
                    id="shippingStreet"
                    type="text"
                    required
                    value={shippingStreet}
                    onChange={(e) => setShippingStreet(e.target.value)}
                    className={inputClass}
                    placeholder="Ermou 12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="shippingCity"
                      className="block text-cream/70 text-sm mb-1"
                    >
                      {t.checkout.city}
                    </label>
                    <input
                      id="shippingCity"
                      type="text"
                      required
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className={inputClass}
                      placeholder="Athens"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="shippingPostalCode"
                      className="block text-cream/70 text-sm mb-1"
                    >
                      {t.checkout.postalCode}
                    </label>
                    <input
                      id="shippingPostalCode"
                      type="text"
                      required
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      className={inputClass}
                      placeholder="11524"
                      maxLength={5}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="shippingCountry"
                    className="block text-cream/70 text-sm mb-1"
                  >
                    {t.checkout.country}
                  </label>
                  <select
                    id="shippingCountry"
                    disabled
                    value={shippingCountry}
                    className={`${inputClass} opacity-70`}
                  >
                    <option value="GR">{t.checkout.greece}</option>
                  </select>
                  <p className="text-cream/40 text-xs mt-1">
                    {t.checkout.shippingNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="font-heading text-xl text-gold mb-6">
                {t.checkout.orderSummary}
              </h2>
              <div className="bg-navy-light border border-gold/10 rounded-lg p-6 space-y-4">
                {cart.map((item) => {
                  const symbol = item.currency === "EUR" ? "\u20AC" : "$";
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-cream truncate">{item.name}</p>
                        <p className="text-cream/40">{t.checkout.qty} {item.quantity}</p>
                      </div>
                      <p className="text-gold ml-4">
                        {symbol}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}

                <div className="border-t border-gold/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/60">{t.checkout.subtotal}</span>
                    <span className="text-cream">
                      &euro;{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/60">{t.checkout.shipping}</span>
                    <span className="text-cream">
                      {shippingCost !== null ? (
                        <>
                          &euro;{shippingCost.toFixed(2)}
                          <span className="text-cream/40 text-xs ml-1">
                            {shippingCost === 4
                              ? t.checkout.athens
                              : t.checkout.restOfGreece}
                          </span>
                        </>
                      ) : (
                        <span className="text-cream/40">
                          {t.checkout.enterPostalCode}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-gold/10 pt-2">
                    <span className="text-cream/60">{t.checkout.total}</span>
                    <span className="text-gold font-heading">
                      {total !== null ? (
                        <>&euro;{total.toFixed(2)}</>
                      ) : (
                        <span className="text-cream/40 text-base">--</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || shippingCost === null}
                className="w-full mt-6 bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
              >
                {submitting ? t.checkout.redirecting : t.checkout.payNow}
              </button>

              <Link
                href="/cart"
                className="block text-center text-gold/60 hover:text-gold text-sm mt-4 transition-colors"
              >
                {t.checkout.backToCart}
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
