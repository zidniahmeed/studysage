"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, BookOpen, Zap, Layers, ArrowLeft } from "lucide-react";
import ChatBubble, { Message } from "@/components/ChatBubble";
import FlashcardView from "@/components/FlashcardView";

type Mode = "explain" | "quiz" | "flashcard";

const MODE_CONFIG: Record<Mode, { icon: React.ReactNode; label: string; hint: string; color: string }> = {
  explain: {
    icon: <BookOpen size={16} />,
    label: "Explain",
    hint: "Ask Ryo to explain any topic...",
    color: "#4ade80",
  },
  quiz: {
    icon: <Zap size={16} />,
    label: "Quiz",
    hint: "Enter a topic for quiz questions...",
    color: "#f59e0b",
  },
  flashcard: {
    icon: <Layers size={16} />,
    label: "Flashcard",
    hint: "Paste your study material here...",
    color: "#818cf8",
  },
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hey there, young scholar! ⚔️ I'm **Ryo**, your AI Study Sensei.\n\nI'm here to help you master any subject. Choose a mode:\n- **Explain** — Ask me anything and I'll break it down clearly\n- **Quiz** — Give me a topic and I'll test your knowledge\n- **Flashcard** — Paste your notes and I'll turn them into study cards\n\nWhat shall we conquer today?",
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid var(--primary-dim)" }}>
        <Image src="/ryo-avatar.png" alt="Ryo" width={36} height={36} className="object-cover object-top" />
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
        style={{
          background: "var(--ryo-bubble)",
          border: "1px solid var(--border)",
          borderBottomLeftRadius: "4px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot block w-2 h-2 rounded-full"
            style={{ background: "var(--primary)", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [mode, setMode] = useState<Mode>("explain");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, text: m.text })),
          mode,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "⚠️ Ryo's connection was interrupted. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  const currentMode = MODE_CONFIG[mode];

  return (
    <div style={{ background: "var(--bg)", height: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" id="back-home" className="p-1.5 rounded-lg transition-colors hover:bg-white/5">
            <ArrowLeft size={18} style={{ color: "var(--text-muted)" }} />
          </Link>
          <Image src="/logo.png" alt="StudySage" width={28} height={28} className="rounded" />
          <span className="font-bold" style={{ color: "var(--primary)" }}>StudySage</span>
        </div>

        {/* Mode pills — desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG[Mode]][]).map(([key, cfg]) => (
            <button
              key={key}
              id={`mode-${key}`}
              onClick={() => setMode(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                mode === key
                  ? { background: cfg.color + "22", color: cfg.color, border: `1px solid ${cfg.color}55` }
                  : { background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)" }
              }
            >
              {cfg.icon}
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Mobile sidebar toggle */}
        <button
          className="sm:hidden p-2 rounded-lg"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          id="mobile-sidebar-toggle"
        >
          <Image src="/ryo-avatar.png" alt="Ryo" width={24} height={24} className="rounded-full object-cover object-top" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <AnimatePresence>
          {(true) && (
            <motion.aside
              className={`
                ${sidebarOpen ? "flex" : "hidden"} sm:flex
                flex-col items-center py-8 px-4 gap-6 shrink-0
              `}
              style={{
                width: "220px",
                background: "var(--bg-surface)",
                borderRight: "1px solid var(--border)",
              }}
              initial={{ x: -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -220, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Avatar */}
              <div
                className="rounded-2xl overflow-hidden animate-pulse-glow"
                style={{ width: 140, height: 140, border: "2px solid var(--primary-dim)" }}
              >
                <Image
                  src="/ryo-avatar.png"
                  alt="Ryo"
                  width={140}
                  height={140}
                  className="object-cover object-top w-full h-full"
                />
              </div>
              <div className="text-center">
                <p className="font-bold text-base" style={{ color: "var(--primary)" }}>Ryo</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>AI Study Sensei</p>
              </div>

              {/* Divider */}
              <div className="w-full" style={{ height: "1px", background: "var(--border)" }} />

              {/* Mode selector */}
              <div className="w-full flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                  Mode
                </p>
                {(Object.entries(MODE_CONFIG) as [Mode, typeof MODE_CONFIG[Mode]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    id={`sidebar-mode-${key}`}
                    onClick={() => { setMode(key); setSidebarOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all w-full"
                    style={
                      mode === key
                        ? { background: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}44` }
                        : { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" }
                    }
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full" style={{ height: "1px", background: "var(--border)" }} />

              {/* Stats */}
              <div className="w-full">
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                  Session
                </p>
                <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>Messages</span>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>{messages.length - 1}</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Chat area ── */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6" style={{ scrollBehavior: "smooth" }}>
            <div className="max-w-2xl mx-auto flex flex-col gap-5">
              {messages.map((msg) =>
                msg.role === "assistant" && mode === "flashcard" && msg.id !== "welcome" && msg.text.includes("FRONT:") ? (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid var(--primary-dim)" }}>
                      <Image src="/ryo-avatar.png" alt="Ryo" width={36} height={36} className="object-cover object-top" />
                    </div>
                    <div
                      className="flex-1 rounded-2xl px-4 py-4"
                      style={{ background: "var(--ryo-bubble)", border: "1px solid var(--border)", borderBottomLeftRadius: "4px" }}
                    >
                      <FlashcardView text={msg.text} />
                    </div>
                  </motion.div>
                ) : (
                  <ChatBubble key={msg.id} msg={msg} />
                )
              )}

              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── Input bar ── */}
          <div
            className="shrink-0 px-4 py-4"
            style={{ borderTop: "1px solid var(--border)", background: "var(--bg-surface)" }}
          >
            <div className="max-w-2xl mx-auto">
              {/* Active mode hint */}
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: currentMode.color }} className="text-xs font-semibold flex items-center gap-1">
                  {currentMode.icon} {currentMode.label} mode
                </span>
              </div>

              <div
                className="flex items-end gap-3 rounded-xl px-4 py-3"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <textarea
                  ref={textareaRef}
                  id="chat-input"
                  value={input}
                  onChange={autoResize}
                  onKeyDown={handleKeyDown}
                  placeholder={currentMode.hint}
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed"
                  style={{ color: "var(--text)", maxHeight: "160px" }}
                />
                <button
                  id="send-btn"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={
                    input.trim() && !loading
                      ? { background: "var(--primary)", color: "#080D1A" }
                      : { background: "var(--accent)", color: "var(--text-muted)", opacity: 0.5 }
                  }
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
