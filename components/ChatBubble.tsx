"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Volume2, Square } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface ChatBubbleProps {
  msg: Message;
  autoPlay?: boolean;
  onSpeak?: (speaking: boolean) => void;
}

export default function ChatBubble({ msg, autoPlay, onSpeak }: ChatBubbleProps) {
  const isUser = msg.role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onSpeak) onSpeak(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown symbols for cleaner speech
    const cleanText = msg.text.replace(/[*_#`]/g, "").replace(/\[.*?\]\(.*?\)/g, "");
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (onSpeak) onSpeak(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onSpeak) onSpeak(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onSpeak) onSpeak(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlay && !isUser) {
      // Small timeout to allow DOM to render
      const timer = setTimeout(() => {
        toggleSpeech();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex items-end gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className={`shrink-0 w-8 h-8 rounded-full overflow-hidden mb-1 opacity-80 ${isSpeaking ? "animate-talking" : ""}`}>
            <Image src="/ryo-avatar.png" alt="Ryo" width={32} height={32} className="object-cover object-top grayscale hover:grayscale-0 transition-all" />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`max-w-[75%] px-5 py-4 text-sm leading-relaxed relative group ${isUser ? 'rounded-[24px] rounded-br-md' : 'rounded-[24px] rounded-bl-md'}`}
          style={
            isUser
              ? {
                  background: "var(--cream)",
                  color: "var(--text-dark)",
                }
              : {
                  background: "var(--purple-dark)",
                  color: "var(--text-light)",
                  border: "1px solid var(--border-color)",
                }
          }
        >
          {isUser ? (
            <p>{msg.text}</p>
          ) : (
            <>
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {/* TTS Button */}
              <button 
                onClick={toggleSpeech}
                className="absolute -right-10 bottom-1 p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                title={isSpeaking ? "Stop speaking" : "Read aloud (English)"}
              >
                {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
              </button>
            </>
          )}
        </div>
        
        {/* User Avatar (Optional, matching the aesthetic) */}
        {isUser && (
          <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden mb-1 bg-[var(--cream)]/20 border border-[var(--border-color)] flex items-center justify-center">
            <span className="text-xs">You</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
