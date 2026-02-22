"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface Booking {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  locale: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "no-show", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  "no-show": "bg-red-500/10 text-red-400",
  cancelled: "bg-cream/10 text-cream/40",
};

export default function AdminBookingsPage() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  const [updatingBooking, setUpdatingBooking] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.status === 403) {
        setError("You do not have admin access.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Failed to load bookings");
    }
    setLoading(false);
  };

  const updateStatus = async (bookingId: number, status: string) => {
    setUpdatingBooking(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
        );
      }
    } catch {
      // ignore
    }
    setUpdatingBooking(null);
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

  const activeBookings = bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed" && b.status !== "no-show");
  const pastBookings = bookings.filter((b) => b.status === "cancelled" || b.status === "completed" || b.status === "no-show");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-cream">{t.adminBookings.title}</h1>
        <p className="text-cream/40 mt-1">{bookings.length} {t.adminBookings.totalBookings}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cream/40 text-lg">{t.adminBookings.noBookings}</p>
        </div>
      ) : (
        <>
          {/* Active bookings */}
          {activeBookings.length > 0 && (
            <div className="mb-10">
              <h2 className="text-cream/60 text-xs uppercase tracking-wider mb-4">
                {t.adminBookings.upcoming} ({activeBookings.length})
              </h2>
              <div className="space-y-3">
                {activeBookings.map((booking) => renderBookingCard(booking))}
              </div>
            </div>
          )}

          {/* Past bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-cream/60 text-xs uppercase tracking-wider mb-4">
                {t.adminBookings.past} ({pastBookings.length})
              </h2>
              <div className="space-y-3">
                {pastBookings.map((booking) => renderBookingCard(booking))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  function renderBookingCard(booking: Booking) {
    const isExpanded = expandedBooking === booking.id;
    return (
      <div
        key={booking.id}
        className="bg-navy-light border border-gold/10 rounded-lg overflow-hidden"
      >
        {/* Booking Header */}
        <button
          onClick={() =>
            setExpandedBooking(isExpanded ? null : booking.id)
          }
          className="w-full flex items-center justify-between p-4 hover:bg-gold/5 transition-colors text-left"
        >
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gold font-heading text-lg">
              #{booking.id}
            </span>
            <span
              className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${STATUS_COLORS[booking.status] || "bg-cream/10 text-cream/60"}`}
            >
              {booking.status}
            </span>
            <span className="text-cream/80 text-sm font-medium">
              {booking.name || t.adminBookings.anonymous}
            </span>
            <span className="text-cream/50 text-sm">
              {booking.date} — {booking.time}
            </span>
          </div>
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
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gold/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Details */}
              <div>
                <h3 className="text-cream/50 text-xs uppercase tracking-wider mb-2">
                  {t.adminBookings.details}
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.name}</span>
                    <span className="text-cream">{booking.name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.email}</span>
                    <span className="text-cream">{booking.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.date}</span>
                    <span className="text-cream">{booking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.time}</span>
                    <span className="text-cream">{booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.language}</span>
                    <span className="text-cream">{booking.locale === "el" ? "Greek" : "English"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">{t.adminBookings.bookedOn}</span>
                    <span className="text-cream/60">
                      {new Date(booking.createdAt).toLocaleDateString("el-GR")}{" "}
                      {new Date(booking.createdAt).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div>
                <h3 className="text-cream/50 text-xs uppercase tracking-wider mb-2">
                  {t.adminBookings.contact}
                </h3>
                <div className="space-y-2">
                  {booking.email && (
                    <a
                      href={`mailto:${booking.email}`}
                      className="block text-sm text-gold hover:text-gold-light transition-colors"
                    >
                      {booking.email}
                    </a>
                  )}
                  <a
                    href="https://ig.me/m/komninakis.m"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-gold/60 hover:text-gold transition-colors"
                  >
                    Instagram DM &rarr;
                  </a>
                </div>
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
                        booking.status === s ||
                        updatingBooking === booking.id
                      }
                      onClick={() => updateStatus(booking.id, s)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                        booking.status === s
                          ? "bg-gold/20 text-gold font-medium"
                          : "text-cream/60 hover:bg-gold/10 hover:text-cream"
                      } disabled:opacity-50`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                      {booking.status === s && ` ${t.admin.current}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
