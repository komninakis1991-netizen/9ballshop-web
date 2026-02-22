"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface OrderItem {
  name: string;
  quantity: number;
  amount: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  customerEmail: string;
  shippingName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["paid", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-blue-500/10 text-blue-400",
  processing: "bg-yellow-500/10 text-yellow-400",
  shipped: "bg-purple-500/10 text-purple-400",
  delivered: "bg-emerald/10 text-emerald",
  cancelled: "bg-red-500/10 text-red-400",
};

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.status === 403) {
        setError("You do not have admin access.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: number, status: string) => {
    setUpdatingOrder(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
        );
      }
    } catch {
      // ignore
    }
    setUpdatingOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-cream/40">{t.account.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-cream">{t.admin.title}</h1>
        <p className="text-cream/40 mt-1">{orders.length} {t.admin.totalOrders}</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cream/40 text-lg">{t.admin.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div
                key={order.id}
                className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gold/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gold font-heading text-lg">
                      #{order.id}
                    </span>
                    <span
                      className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${STATUS_COLORS[order.status] || "bg-cream/10 text-cream/60"}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-cream/50 text-sm">
                      {order.shippingName || order.customerEmail}
                    </span>
                    <span className="text-cream/30 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("el-GR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gold font-heading text-lg">
                      &euro;{order.total.toFixed(2)}
                    </span>
                    <svg
                      className={`w-5 h-5 text-cream/30 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gold/10 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Items */}
                      <div>
                        <h3 className="text-cream/50 text-xs uppercase tracking-wider mb-2">
                          {t.admin.items}
                        </h3>
                        <div className="space-y-1">
                          {order.items.map(
                            (item: OrderItem, i: number) => (
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
                            ),
                          )}
                          <div className="border-t border-gold/5 pt-1 mt-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-cream/50">{t.admin.shipping}</span>
                              <span className="text-cream">
                                &euro;{order.shippingCost.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-cream/70">{t.admin.total}</span>
                              <span className="text-gold">
                                &euro;{order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h3 className="text-cream/50 text-xs uppercase tracking-wider mb-2">
                          {t.admin.shipTo}
                        </h3>
                        <div className="text-sm text-cream/80 space-y-1">
                          <p className="font-medium text-cream">
                            {order.shippingName}
                          </p>
                          {order.shippingPhone && (
                            <p>{order.shippingPhone}</p>
                          )}
                          <p>{order.shippingStreet}</p>
                          <p>
                            {order.shippingCity}, {order.shippingPostalCode}
                          </p>
                          <p className="text-cream/50">
                            {order.shippingCountry === "GR"
                              ? "Greece"
                              : order.shippingCountry}
                          </p>
                        </div>
                        {order.customerEmail && (
                          <p className="text-cream/40 text-xs mt-2">
                            {order.customerEmail}
                          </p>
                        )}
                      </div>

                      {/* Status Update */}
                      <div>
                        <h3 className="text-cream/50 text-xs uppercase tracking-wider mb-2">
                          {t.admin.updateStatus}
                        </h3>
                        <div className="space-y-2">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              disabled={
                                order.status === s ||
                                updatingOrder === order.id
                              }
                              onClick={() => updateStatus(order.id, s)}
                              className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                                order.status === s
                                  ? "bg-gold/20 text-gold font-medium"
                                  : "text-cream/60 hover:bg-gold/10 hover:text-cream"
                              } disabled:opacity-50`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                              {order.status === s && ` ${t.admin.current}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
