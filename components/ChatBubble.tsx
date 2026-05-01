"use client";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export default function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <AnimatePresence>
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="shrink-0 w-9 h-9 rounded-full overflow-hidden" style={{ border: "2px solid var(--primary-dim)" }}>
            <Image src="/ryo-avatar.png" alt="Ryo" width={36} height={36} className="object-cover object-top" />
          </div>
        )}

        {/* Bubble */}
        <div
          className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "var(--user-bubble)",
                  borderBottomRightRadius: "4px",
                  color: "var(--text)",
                }
              : {
                  background: "var(--ryo-bubble)",
                  border: "1px solid var(--border)",
                  borderBottomLeftRadius: "4px",
                  color: "var(--text)",
                }
          }
        >
          {isUser ? (
            <p>{msg.text}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
