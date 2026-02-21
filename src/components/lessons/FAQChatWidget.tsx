"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const INSTAGRAM_DM = "https://ig.me/m/komninakis.m";

type Message = {
  from: "user" | "bot";
  text: string;
};

// Keywords mapped per question index (bilingual matching)
const KEYWORD_MAP: { keywords: string[]; index: number }[] = [
  { keywords: ["cost", "price", "pricing", "how much", "κόστος", "τιμή", "πόσο κοστίζ"], index: 0 },
  { keywords: ["how long", "duration", "minutes", "hour", "πόση ώρα", "διάρκε", "λεπτά"], index: 1 },
  { keywords: ["where", "online", "in-person", "location", "πού", "τοποθεσί", "δια ζώσης", "ζωσης"], index: 2 },
  { keywords: ["own cue", "my cue", "equipment", "στέκα", "εξοπλισμ", "δική μου"], index: 3 },
  { keywords: ["level", "beginner", "advanced", "experience", "επίπεδο", "αρχάριος", "αρχαριος", "εμπειρί"], index: 4 },
  { keywords: ["trial", "try", "free", "δοκιμ", "δωρεάν", "δωρεαν"], index: 5 },
  { keywords: ["what will i learn", "learn", "teach", "μάθω", "μαθω", "διδάσκ", "διδασκ"], index: 6 },
  { keywords: ["how do i book", "book", "schedule", "κλείσω", "κλεισω", "ραντεβού", "ραντεβου"], index: 7 },
];

function findAnswer(
  input: string,
  faq: Record<string, string>
): string | null {
  const lower = input.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      const key = `a${entry.index + 1}` as keyof typeof faq;
      return faq[key] || null;
    }
  }
  return null;
}

export default function FAQChatWidget() {
  const { t } = useLanguage();
  const faq = t.lessonsFaq;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questionKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleQuestion(question: string) {
    const answer = findAnswer(question, faq as unknown as Record<string, string>);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "bot", text: answer || faq.noMatch },
    ]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    handleQuestion(trimmed);
  }

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold hover:bg-gold-light text-navy rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label={faq.widgetTitle}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-40 w-full sm:w-[380px] h-[100dvh] sm:h-auto sm:max-h-[520px] bg-navy-light border-t sm:border border-gold/20 sm:rounded-2xl flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/10 flex-shrink-0">
            <h3 className="font-heading text-base text-cream">
              {faq.widgetTitle}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cream/40 hover:text-cream transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.length === 0 && (
              <div>
                <p className="text-cream/40 text-xs uppercase tracking-wider mb-3">
                  {faq.suggestedQuestions}
                </p>
                <div className="flex flex-wrap gap-2">
                  {questionKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleQuestion(faq[key])}
                      className="text-xs bg-navy border border-gold/10 hover:border-gold/30 text-cream/70 hover:text-cream px-3 py-2 rounded-full transition-colors text-left"
                    >
                      {faq[key]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  msg.from === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-gold/20 text-cream rounded-br-sm"
                      : "bg-navy border border-gold/10 text-cream/80 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Show suggested questions again after messages */}
            {messages.length > 0 && (
              <div>
                <p className="text-cream/40 text-xs uppercase tracking-wider mb-2 mt-2">
                  {faq.suggestedQuestions}
                </p>
                <div className="flex flex-wrap gap-2">
                  {questionKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleQuestion(faq[key])}
                      className="text-xs bg-navy border border-gold/10 hover:border-gold/30 text-cream/70 hover:text-cream px-3 py-2 rounded-full transition-colors text-left"
                    >
                      {faq[key]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input + Instagram CTA */}
          <div className="border-t border-gold/10 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={faq.widgetPlaceholder}
                className="flex-1 bg-navy border border-gold/10 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/30"
              />
              <button
                type="submit"
                className="bg-gold hover:bg-gold-light text-navy px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <a
              href={INSTAGRAM_DM}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-gold/70 hover:text-gold pb-3 transition-colors"
            >
              {faq.askMarios}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
