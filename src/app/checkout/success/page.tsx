"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface OrderItem {
  name: string;
  quantity: number;
  amount: number;
}

interface OrderData {
  id: number;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  customerEmail: string;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const { t } = useLanguage();
  return (
    <Suspense
      fallback={
        <div className="bg-navy min-h-screen flex items-center justify-center">
          <p className="text-cream/40">{t.success.loading}</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [retries, setRetries] = useState(0);

  // Clear cart on mount
  useEffect(() => {
    localStorage.removeItem("9ballshop-cart");
  }, []);

  const fetchOrder = useCallback(async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders?session_id=${sessionId}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setLoading(false);
      } else if (retries < 10) {
        // Webhook may not have fired yet, retry
        setTimeout(() => setRetries((r) => r + 1), 2000);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, [sessionId, retries]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <div className="bg-navy min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-emerald"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl text-cream mb-2">{t.success.title}</h1>
          <p className="text-cream/60">
            {t.success.description}
          </p>
        </div>

        {/* Order Details */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-cream/40">{t.success.loadingDetails}</p>
          </div>
        ) : order ? (
          <div className="bg-navy-light border border-gold/10 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg text-gold">
                Order #{order.id}
              </h2>
              <span className="text-xs uppercase tracking-wider px-2 py-1 rounded bg-emerald/10 text-emerald">
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4">
              {order.items.map((item: OrderItem, i: number) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span className="text-cream/80">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-cream">
                    &euro;{(item.amount / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gold/10 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">{t.success.subtotal}</span>
                <span className="text-cream">
                  &euro;{order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream/50">{t.success.shipping}</span>
                <span className="text-cream">
                  &euro;{order.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gold/10 pt-2">
                <span className="text-cream/70">{t.success.total}</span>
                <span className="text-gold">
                  &euro;{order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingStreet && (
              <div className="border-t border-gold/10 pt-3 mt-3">
                <p className="text-cream/50 text-xs uppercase tracking-wider mb-1">
                  {t.success.shippingTo}
                </p>
                <p className="text-cream/80 text-sm">
                  {order.shippingName}
                  <br />
                  {order.shippingStreet}
                  <br />
                  {order.shippingCity}, {order.shippingPostalCode}
                </p>
              </div>
            )}

            {order.customerEmail && (
              <p className="text-cream/40 text-xs mt-4">
                {t.success.confirmationEmail} {order.customerEmail}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-navy-light border border-gold/10 rounded-xl p-6 mb-8 text-center">
            <p className="text-cream/60">
              {t.success.processing}
            </p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/shop"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-3 rounded transition-colors text-sm uppercase tracking-wider"
          >
            {t.success.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
