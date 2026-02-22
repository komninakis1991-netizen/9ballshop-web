"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const TIME_SLOTS = ["17:00", "17:15", "17:30", "17:45"];
const DAYS_AHEAD = 14;
const INSTAGRAM_DM = "https://ig.me/m/komninakis.m";

interface BookedSlot {
  date: string;
  time: string;
}

function generateDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date: Date, monthNames: string[]): string {
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
}

export default function DiscoveryCalendar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale } = useLanguage();
  const [dates] = useState(generateDates);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch booked slots when modal opens
  useEffect(() => {
    if (open) {
      fetch("/api/discovery-booking")
        .then((res) => res.json())
        .then((data) => setBookedSlots(data.bookedSlots || []))
        .catch(() => {});
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setSelectedTime(null);
      setCopied(false);
      setName("");
      setEmail("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  function isSlotBooked(dateStr: string, time: string): boolean {
    return bookedSlots.some((s) => s.date === dateStr && s.time === time);
  }

  function getDayLabel(index: number): string {
    if (index === 0) return t.lessons.calendarToday;
    if (index === 1) return t.lessons.calendarTomorrow;
    return t.lessons.calendarDayNames[dates[index].getDay()];
  }

  async function handleConfirm() {
    if (selectedTime === null || submitting) return;
    const date = dates[selectedDate];
    const dateStr = formatDate(date, t.lessons.calendarMonthNames);

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/discovery-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          date: dateStr,
          time: selectedTime,
          locale,
        }),
      });

      if (res.status === 409) {
        setError(t.lessons.calendarSlotTaken);
        // Refresh booked slots
        fetch("/api/discovery-booking")
          .then((r) => r.json())
          .then((data) => setBookedSlots(data.bookedSlots || []))
          .catch(() => {});
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setError(t.lessons.calendarBookingFailed);
        setSubmitting(false);
        return;
      }

      // Update local booked slots
      setBookedSlots((prev) => [...prev, { date: dateStr, time: selectedTime }]);

      const message = t.lessons.calendarPrefillMessage
        .replace("{date}", dateStr)
        .replace("{time}", selectedTime);

      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => {
          window.open(INSTAGRAM_DM, "_blank");
        }, 600);
      } catch {
        window.open(INSTAGRAM_DM, "_blank");
      }
    } catch {
      setError(t.lessons.calendarBookingFailed);
    }
    setSubmitting(false);
  }

  if (!open) return null;

  const currentDateStr = formatDate(
    dates[selectedDate],
    t.lessons.calendarMonthNames
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-md bg-navy-light border border-gold/20 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl text-cream">
            {t.lessons.calendarTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-cream/40 hover:text-cream transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={t.lessons.calendarClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">
            {t.lessons.calendarName}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.lessons.calendarNamePlaceholder}
            className="w-full bg-navy border border-gold/10 text-cream rounded-lg px-4 py-3 text-sm placeholder:text-cream/30 focus:border-gold/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Email input */}
        <div className="mb-5">
          <label className="text-cream/50 text-xs uppercase tracking-wider block mb-2">
            {t.lessons.calendarEmail}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.lessons.calendarEmailPlaceholder}
            className="w-full bg-navy border border-gold/10 text-cream rounded-lg px-4 py-3 text-sm placeholder:text-cream/30 focus:border-gold/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Date strip */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1 scrollbar-hide">
          {dates.map((date, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedDate(i);
                setSelectedTime(null);
                setCopied(false);
                setError("");
              }}
              className={`flex-shrink-0 w-16 py-3 rounded-lg text-center transition-colors ${
                selectedDate === i
                  ? "bg-gold text-navy"
                  : "bg-navy border border-gold/10 text-cream/60 hover:border-gold/30"
              }`}
            >
              <div className="text-xs font-medium">{getDayLabel(i)}</div>
              <div className="text-lg font-heading">{date.getDate()}</div>
            </button>
          ))}
        </div>

        {/* Time slots */}
        <p className="text-cream/50 text-xs uppercase tracking-wider mb-3">
          {t.lessons.calendarTimeSlots}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {TIME_SLOTS.map((time) => {
            const booked = isSlotBooked(currentDateStr, time);
            return (
              <button
                key={time}
                disabled={booked}
                onClick={() => {
                  setSelectedTime(time);
                  setCopied(false);
                  setError("");
                }}
                className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                  booked
                    ? "bg-navy border border-gold/5 text-cream/20 cursor-not-allowed line-through"
                    : selectedTime === time
                      ? "bg-gold text-navy"
                      : "bg-navy border border-gold/10 text-cream/70 hover:border-gold/30"
                }`}
              >
                {booked ? `${time} — ${t.lessons.calendarBooked}` : time}
              </button>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Confirm */}
        {selectedTime && (
          <div className="space-y-3">
            <p className="text-cream/50 text-sm">
              {t.lessons.calendarSelectedSlot}{" "}
              <span className="text-gold">
                {currentDateStr} — {selectedTime}
              </span>
            </p>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded-lg transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {submitting
                ? t.lessons.calendarSubmitting
                : copied
                  ? t.lessons.messageCopied
                  : t.lessons.calendarConfirm}
            </button>
            <p className="text-cream/40 text-xs text-center">
              {t.lessons.calendarConfirmDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
