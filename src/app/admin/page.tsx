"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface Order {
  id: number;
  status: string;
  total: number;
  customerEmail: string;
  shippingName: string;
  createdAt: string;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

interface ActivityItem {
  type: "order" | "booking";
  id: number;
  label: string;
  date: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/orders").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
    ])
      .then(([ordersData, bookingsData]) => {
        setOrders(ordersData.orders || []);
        setBookings(bookingsData.bookings || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-cream/40">{t.account.loading}</p>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "paid" || o.status === "processing").length;
  const upcomingBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  ).length;

  // Recent activity: latest 5 orders + 5 bookings, combined and sorted
  const recentOrders: ActivityItem[] = orders
    .slice(0, 5)
    .map((o) => ({
      type: "order" as const,
      id: o.id,
      label: `${t.adminPanel.order} #${o.id} — ${o.shippingName || o.customerEmail}`,
      date: o.createdAt,
      status: o.status,
    }));

  const recentBookings: ActivityItem[] = bookings
    .slice(0, 5)
    .map((b) => ({
      type: "booking" as const,
      id: b.id,
      label: `${t.adminPanel.booking} #${b.id} — ${b.name || b.email}`,
      date: b.createdAt,
      status: b.status,
    }));

  const recentActivity = [...recentOrders, ...recentBookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const stats = [
    { label: t.adminPanel.totalOrders, value: orders.length, color: "text-blue-400" },
    { label: t.adminPanel.pendingOrders, value: pendingOrders, color: "text-yellow-400" },
    { label: t.adminPanel.totalBookings, value: bookings.length, color: "text-purple-400" },
    { label: t.adminPanel.upcomingBookings, value: upcomingBookings, color: "text-emerald-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-cream">{t.adminPanel.dashboard}</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-navy-light border border-gold/10 rounded-lg p-5"
          >
            <p className="text-cream/50 text-xs uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`font-heading text-3xl ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-navy-light border border-gold/10 rounded-lg">
        <div className="px-5 py-4 border-b border-gold/10">
          <h2 className="font-heading text-lg text-cream">{t.adminPanel.recentActivity}</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-cream/40">{t.adminPanel.noActivity}</p>
          </div>
        ) : (
          <div className="divide-y divide-gold/5">
            {recentActivity.map((item) => (
              <div key={`${item.type}-${item.id}`} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.type === "order" ? "bg-blue-400" : "bg-purple-400"
                    }`}
                  />
                  <span className="text-cream/80 text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cream/30 text-xs uppercase tracking-wider">
                    {item.status}
                  </span>
                  <span className="text-cream/20 text-xs">
                    {new Date(item.date).toLocaleDateString("el-GR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
