"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function AccountPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, loading, logout, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressCountry, setAddressCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddressStreet(user.addressStreet);
      setAddressCity(user.addressCity);
      setAddressPostalCode(user.addressPostalCode);
      setAddressCountry(user.addressCountry);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        addressStreet,
        addressCity,
        addressPostalCode,
        addressCountry,
      }),
    });

    setSaving(false);

    if (res.ok) {
      setMessage(t.account.updateSuccess);
      await refreshUser();
    } else {
      const data = await res.json();
      setMessage(data.error || t.account.updateFailed);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    setCancelMessage("");
    try {
      const res = await fetch("/api/members/cancel", { method: "POST" });
      if (res.ok) {
        setCancelMessage(t.account.cancelSuccess);
        setShowCancelConfirm(false);
        await refreshUser();
      } else {
        const data = await res.json();
        setCancelMessage(data.error || t.account.cancelFailed);
      }
    } catch {
      setCancelMessage(t.account.cancelFailed);
    }
    setCancelling(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <p className="text-cream/50">{t.account.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl text-gold">{t.account.title}</h1>
          <button
            onClick={handleLogout}
            className="text-cream/50 hover:text-cream text-sm border border-cream/20 rounded-lg px-4 py-2 transition-colors"
          >
            {t.account.logOut}
          </button>
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-xl p-6 mb-6">
          <p className="text-cream/50 text-sm">{t.account.email}</p>
          <p className="text-cream">{user.email}</p>
        </div>

        <div className="bg-navy-light border border-gold/10 rounded-xl p-6 mb-6">
          <h2 className="font-heading text-xl text-gold mb-3">
            {t.account.membership}
          </h2>
          <p className="text-cream/70 text-sm mb-4">
            {user.membershipStatus === "active"
              ? t.account.membershipActive
              : t.account.membershipNone}
          </p>

          {cancelMessage && (
            <div
              className={`px-4 py-3 rounded-lg text-sm mb-4 ${
                cancelMessage === t.account.cancelSuccess
                  ? "bg-green-900/30 border border-green-500/50 text-green-300"
                  : "bg-red-900/30 border border-red-500/50 text-red-300"
              }`}
            >
              {cancelMessage}
            </div>
          )}

          {user.membershipStatus === "active" && user.stripeSubscriptionId && (
            <>
              {showCancelConfirm ? (
                <div className="space-y-3">
                  <p className="text-cream/60 text-sm">{t.account.cancelConfirm}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancelling ? t.account.cancelling : t.account.cancelSubscription}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="border border-cream/20 text-cream/50 hover:text-cream text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      {t.account.cancelBack}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-red-400 hover:text-red-300 text-sm border border-red-500/30 rounded-lg px-4 py-2 transition-colors"
                >
                  {t.account.cancelSubscription}
                </button>
              )}
            </>
          )}
        </div>

        <form
          onSubmit={handleSave}
          className="bg-navy-light border border-gold/10 rounded-xl p-6 space-y-5"
        >
          <h2 className="font-heading text-xl text-gold mb-2">
            {t.account.profileDetails}
          </h2>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm ${
                message.includes("success")
                  ? "bg-green-900/30 border border-green-500/50 text-green-300"
                  : "bg-red-900/30 border border-red-500/50 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-cream/70 text-sm mb-1">
              {t.account.name}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.account.phone}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
            />
          </div>

          <div>
            <label
              htmlFor="street"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.account.streetAddress}
            </label>
            <input
              id="street"
              type="text"
              value={addressStreet}
              onChange={(e) => setAddressStreet(e.target.value)}
              className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-cream/70 text-sm mb-1"
              >
                {t.account.city}
              </label>
              <input
                id="city"
                type="text"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-cream/70 text-sm mb-1"
              >
                {t.account.postalCode}
              </label>
              <input
                id="postalCode"
                type="text"
                value={addressPostalCode}
                onChange={(e) => setAddressPostalCode(e.target.value)}
                className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-cream/70 text-sm mb-1"
            >
              {t.account.country}
            </label>
            <input
              id="country"
              type="text"
              value={addressCountry}
              onChange={(e) => setAddressCountry(e.target.value)}
              className="w-full bg-navy border border-gold/10 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gold text-navy font-heading font-bold py-3 rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? t.account.saving : t.account.saveChanges}
          </button>
        </form>
      </div>
    </div>
  );
}
