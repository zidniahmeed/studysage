"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, BookOpen, Zap, Layers, Plus, Mic, HelpCircle, Settings, MessageSquare, Briefcase, FileText, Volume2, VolumeX } from "lucide-react";
import ChatBubble, { Message } from "@/components/ChatBubble";
import FlashcardView from "@/components/FlashcardView";
import Ryo3D from "@/components/Ryo3D";
import Image from "next/image";

type Mode = "explain" | "quiz" | "flashcard";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<Mode>("explain");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalSpeaking, setGlobalSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Cancel speech synthesis on refresh/unmount to prevent ghost audio
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], mode }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", text: data.reply || "Error: No reply" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", text: "Oops, connection to Ryo lost. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-[var(--bg-gradient)] text-[var(--text-light)] overflow-hidden font-sans">
      
      {/* ── LEFT COLUMN: Sidebar ── */}
      <div className="hidden md:flex flex-col w-[260px] h-full py-8 px-6 border-r border-[var(--border-color)]">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 flex gap-0.5">
            <div className="w-5 h-10 bg-white rounded-l-full"></div>
            <div className="w-5 h-10 bg-white rounded-r-full opacity-60"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">StudySage</span>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={() => {
            setMessages([]);
            window.speechSynthesis.cancel();
          }}
          className="w-full btn-cream py-2.5 flex items-center justify-center gap-2 mb-10 text-sm"
        >
          <Plus size={16} /> New Session
        </button>

        {/* Navigation List */}
        <div className="flex flex-col gap-1 flex-1">
          <button onClick={() => setMode("explain")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${mode === "explain" ? "bg-[var(--purple-dark)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>
            <MessageSquare size={16} /> Explain Topic
          </button>
          <button onClick={() => setMode("quiz")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${mode === "quiz" ? "bg-[var(--purple-dark)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>
            <Briefcase size={16} /> Generate Quiz
          </button>
          <button onClick={() => setMode("flashcard")} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${mode === "flashcard" ? "bg-[var(--purple-dark)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}>
            <FileText size={16} /> Smart Flashcards
          </button>
        </div>

        {/* Bottom stats/icons */}
        <div className="flex items-center gap-3 mt-auto border-t border-[var(--border-color)] pt-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--purple-dark)] text-xs text-[var(--text-muted)]"><MessageSquare size={12} /> {messages.length} Messages</div>
        </div>
      </div>

      {/* ── CENTER COLUMN: Main Chat Area ── */}
      <div className="flex-1 flex flex-col relative h-full max-w-4xl mx-auto">
        {/* Top bar mobile only */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <span className="font-bold">StudySage</span>
          <span className="text-xs uppercase bg-white/10 px-2 py-1 rounded-md">{mode}</span>
        </div>

        {/* Top Spacer */}
        <div className="hidden md:flex w-full p-6 justify-center">
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 no-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <MessageSquare size={48} className="mb-4" />
              <p className="text-lg">Start a conversation with Ryo.</p>
              <p className="text-sm text-[var(--text-muted)] mt-2">Currently in {mode} mode.</p>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col py-6">
              {messages.map((msg, index) =>
                mode === "flashcard" && msg.role === "assistant" && msg.text.includes("FRONT:") ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className="w-full flex justify-start mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                      {msg.text.split("\n\n").map((cardText, i) => (
                        <FlashcardView key={i} content={cardText} />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <ChatBubble 
                    key={msg.id} 
                    msg={msg} 
                    autoPlay={isVoiceEnabled && msg.role === "assistant" && index === messages.length - 1} 
                    onSpeak={setGlobalSpeaking} 
                  />
                )
              )}
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--purple-dark)] border border-[var(--border-color)] rounded-[24px] rounded-bl-md px-5 py-4 flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full typing-dot"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full typing-dot"></span>
                    <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full typing-dot"></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-8 left-0 w-full px-4 md:px-12 z-20">
          <div className="w-full bg-[var(--cream)] rounded-full p-2 flex items-center shadow-2xl relative pl-6">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Type a message in ${mode} mode...`}
              className="flex-1 bg-transparent resize-none outline-none py-3 px-2 min-h-[44px] max-h-[120px] text-[var(--text-dark)] placeholder-gray-400 text-sm md:text-base leading-tight"
              rows={1}
            />
            <div className="flex items-center gap-1 shrink-0 px-1">
              <button 
                onClick={() => {
                  setIsVoiceEnabled(!isVoiceEnabled);
                  if (isVoiceEnabled) window.speechSynthesis.cancel();
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isVoiceEnabled ? 'text-[var(--text-dark)] bg-black/5 hover:bg-black/10' : 'text-gray-400 hover:text-gray-600 hover:bg-black/5'}`}
                title={isVoiceEnabled ? "Voice Auto-Play is ON" : "Voice Auto-Play is OFF"}
              >
                {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-[var(--purple-dark)] flex items-center justify-center text-white disabled:opacity-50 hover:bg-black transition-all ml-1"
              >
                <Send size={16} className={input.trim() ? "translate-x-0.5" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Avatar & Tools ── */}
      <div className="hidden lg:flex w-[280px] h-full flex-col py-8 px-6 relative">
        
        {/* Floating Avatar with Glow */}
        <div className="flex flex-col items-center mt-8">
          <div className={`avatar-glow w-32 h-32 rounded-full overflow-hidden mb-4 border border-[var(--border-color)] transition-all ${globalSpeaking ? "animate-talking scale-105" : ""}`}>
            <Ryo3D isSpeaking={globalSpeaking} />
          </div>
          <h2 className="text-xl font-bold">Ryo</h2>
          <p className="text-xs text-[var(--text-muted)] font-medium tracking-wide">AI Study Sensei</p>
        </div>

      </div>

    </div>
  );
}
