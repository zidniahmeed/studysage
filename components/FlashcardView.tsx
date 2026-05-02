"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Flashcard {
  front: string;
  back: string;
}

function parseFlashcards(text: string): Flashcard[] {
  const lines = text.split("\n");
  const cards: Flashcard[] = [];

  for (const line of lines) {
    // Match: FRONT: [...] | BACK: [...]
    const match = line.match(/FRONT:\s*(.+?)\s*\|\s*BACK:\s*(.+)/i);
    if (match) {
      cards.push({ front: match[1].trim(), back: match[2].trim() });
    }
  }

  return cards;
}

function FlipCard({ card, index }: { card: Flashcard; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`flashcard-wrapper h-full ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        {/* Front */}
        <div className="flashcard-front flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--primary)" }}
          >
            Question
          </span>
          <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
            {card.front}
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
            Tap to reveal →
          </p>
        </div>

        {/* Back */}
        <div className="flashcard-back flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#90c0ff" }}
          >
            Answer
          </span>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            {card.back}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FlashcardView({ text }: { text: string }) {
  const cards = parseFlashcards(text);

  if (cards.length === 0) {
    return (
      <div className="prose prose-sm max-w-none">
        <p style={{ color: "var(--text-muted)" }}>{text}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold mb-4" style={{ color: "var(--primary)" }}>
        ⚡ {cards.length} Flashcards generated — tap each to flip!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <FlipCard key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
