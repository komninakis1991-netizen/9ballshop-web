"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const TIME_SLOTS = ["17:00", "17:15", "17:30", "17:45"];
const DAYS_AHEAD = 14;
const INSTAGRAM_DM = "https://ig.me/m/komninakis.m";

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
  const { t } = useLanguage();
  const [dates] = useState(generateDates);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    }
  }, [open]);

  function getDayLabel(index: number): string {
    if (index === 0) return t.lessons.calendarToday;
    if (index === 1) return t.lessons.calendarTomorrow;
    return t.lessons.calendarDayNames[dates[index].getDay()];
  }

  async function handleConfirm() {
    if (selectedTime === null) return;
    const date = dates[selectedDate];
    const dateStr = formatDate(date, t.lessons.calendarMonthNames);
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
      // Fallback: open DM directly
      window.open(INSTAGRAM_DM, "_blank");
    }
  }

  if (!open) return null;

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

        {/* Date strip */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1 scrollbar-hide">
          {dates.map((date, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedDate(i);
                setSelectedTime(null);
                setCopied(false);
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
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => {
                setSelectedTime(time);
                setCopied(false);
              }}
              className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedTime === time
                  ? "bg-gold text-navy"
                  : "bg-navy border border-gold/10 text-cream/70 hover:border-gold/30"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Confirm */}
        {selectedTime && (
          <div className="space-y-3">
            <p className="text-cream/50 text-sm">
              {t.lessons.calendarSelectedSlot}{" "}
              <span className="text-gold">
                {formatDate(dates[selectedDate], t.lessons.calendarMonthNames)}{" "}
                — {selectedTime}
              </span>
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-3 rounded-lg transition-colors text-sm uppercase tracking-wider"
            >
              {copied ? t.lessons.messageCopied : t.lessons.calendarConfirm}
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
