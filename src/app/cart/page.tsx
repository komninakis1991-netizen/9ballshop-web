"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

function saveCart(items: CartItem[]) {
  localStorage.setItem("9ballshop-cart", JSON.stringify(items));
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) {
    return <div className="bg-navy min-h-screen flex items-center justify-center"><p className="text-cream/40">Loading cart...</p></div>;
  }

  return (
    <div className="bg-navy min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] mb-3">Your Selection</p>
          <h1 className="font-heading text-4xl md:text-5xl text-cream">Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/40 text-lg mb-6">Your cart is empty.</p>
            <Link
              href="/shop"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => {
                const symbol = item.currency === "EUR" ? "\u20AC" : "$";
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-6 bg-navy-light border border-gold/10 rounded-lg p-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-mid rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-gold/30 font-heading text-2xl">9</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.slug}`} className="text-cream hover:text-gold transition-colors font-medium line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-cream/40 text-sm">{item.brand}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 border border-gold/20 rounded text-cream/60 hover:border-gold hover:text-cream transition-colors flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-cream w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 border border-gold/20 rounded text-cream/60 hover:border-gold hover:text-cream transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p className="text-gold font-heading text-lg w-24 text-right">
                      {symbol}{(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-cream/30 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total & Checkout */}
            <div className="mt-8 border-t border-gold/10 pt-8">
              <div className="flex items-center justify-between mb-8">
                <span className="text-cream/60 text-lg">Total</span>
                <span className="text-gold font-heading text-3xl">
                  &euro;{total.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-4 justify-end flex-wrap">
                <Link
                  href="/shop"
                  className="border border-gold/30 hover:border-gold text-gold px-6 py-3 rounded transition-colors text-sm uppercase tracking-wider"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => alert("Stripe Checkout integration coming soon!")}
                  className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
