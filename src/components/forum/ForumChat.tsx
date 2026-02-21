"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { timeAgo } from "@/lib/relativeTime";
import UserAvatar from "@/components/forum/UserAvatar";

type ChatMsg = {
  id: number;
  content: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
};

type OptimisticMsg = ChatMsg & { optimistic?: boolean };

function formatTime(dateString: string, t: Record<string, string>) {
  const { key, value } = timeAgo(dateString);
  const template = t[key] || key;
  return value !== undefined ? template.replace("{n}", String(value)) : template;
}

export default function ForumChat() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const membersT = t.members as Record<string, string>;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<OptimisticMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);
  const tempIdRef = useRef(-1);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  // Initial load when opened
  useEffect(() => {
    if (!open || loaded) return;

    fetch("/api/forum/chat")
      .then((r) => (r.ok ? r.json() : { messages: [] }))
      .then((data) => {
        const msgs: ChatMsg[] = data.messages || [];
        setMessages(msgs);
        if (msgs.length > 0) {
          lastIdRef.current = msgs[msgs.length - 1].id;
        }
        setLoaded(true);
        setTimeout(scrollToBottom, 50);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded, scrollToBottom]);

  // Polling every 3s when open
  useEffect(() => {
    if (!open || !loaded) return;

    const interval = setInterval(() => {
      fetch(`/api/forum/chat?after=${lastIdRef.current}`)
        .then((r) => (r.ok ? r.json() : { messages: [] }))
        .then((data) => {
          const newMsgs: ChatMsg[] = data.messages || [];
          if (newMsgs.length === 0) return;

          setMessages((prev) => {
            // Remove optimistic messages that have been confirmed
            const newIds = new Set(newMsgs.map((m) => m.id));
            const filtered = prev.filter(
              (m) => !m.optimistic || !newMsgs.some((n) => n.content === m.content && n.user.id === m.user.id)
            );
            // Avoid duplicates
            const existingIds = new Set(filtered.filter((m) => !m.optimistic).map((m) => m.id));
            const toAdd = newMsgs.filter((m) => !existingIds.has(m.id));
            return [...filtered, ...toAdd];
          });

          const maxId = Math.max(...newMsgs.map((m) => m.id));
          if (maxId > lastIdRef.current) lastIdRef.current = maxId;

          setTimeout(scrollToBottom, 50);
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [open, loaded, scrollToBottom]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || !user) return;

    const tempId = tempIdRef.current--;
    const optimisticMsg: OptimisticMsg = {
      id: tempId,
      content,
      createdAt: new Date().toISOString(),
      user: { id: user.id, name: user.name || user.email, email: user.email },
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");
    setSending(true);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch("/api/forum/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...message, optimistic: false } : m))
        );
        if (message.id > lastIdRef.current) lastIdRef.current = message.id;
      } else {
        // Remove failed optimistic message
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-navy-light border border-gold/10 rounded-lg px-4 py-3 hover:border-gold/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
          </svg>
          <span className="text-cream text-sm font-medium">
            {membersT.chatTitle || "Members Chat"}
          </span>
        </div>
        <span className="text-cream/40 text-xs">
          {open
            ? (membersT.chatToggleClose || "Close")
            : (membersT.chatToggleOpen || "Open")}
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="mt-2 bg-navy-light border border-gold/10 rounded-lg overflow-hidden">
          {/* Message list */}
          <div
            ref={listRef}
            className="h-80 overflow-y-auto p-4 space-y-3"
          >
            {!loaded ? (
              <p className="text-cream/40 text-center text-sm py-10">
                {membersT.loadingForum}
              </p>
            ) : messages.length === 0 ? (
              <p className="text-cream/40 text-center text-sm py-10">
                {membersT.chatNoMessages || "No messages yet. Say hello!"}
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.optimistic ? "opacity-60" : ""}`}
                >
                  <UserAvatar name={msg.user.name || msg.user.email} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-cream text-xs font-medium truncate">
                        {msg.user.name || msg.user.email}
                      </span>
                      <span className="text-cream/30 text-[10px] flex-shrink-0">
                        {formatTime(msg.createdAt, membersT)}
                      </span>
                    </div>
                    <p className="text-cream/80 text-sm break-words">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gold/10 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 500))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={membersT.chatPlaceholder || "Type a message..."}
              className="flex-1 bg-navy border border-gold/10 rounded px-3 py-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/30"
              maxLength={500}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-4 py-2 rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending
                ? (membersT.chatSending || "Sending...")
                : (membersT.chatSend || "Send")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
