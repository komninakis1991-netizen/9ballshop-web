"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  brand: string;
}

interface CartItem extends CartProduct {
  quantity: number;
}

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const [added, setAdded] = useState(false);
  const { t } = useLanguage();

  const addToCart = () => {
    const raw = localStorage.getItem("9ballshop-cart");
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("9ballshop-cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={addToCart}
      className={`w-full py-4 rounded font-semibold text-sm uppercase tracking-wider transition-colors ${
        added
          ? "bg-emerald text-white"
          : "bg-gold hover:bg-gold-light text-navy"
      }`}
    >
      {added ? t.addToCart.added : t.addToCart.add}
    </button>
  );
}
