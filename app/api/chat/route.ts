import { NextRequest, NextResponse } from 'next/server';
import { askGemini, ChatMessage } from '@/lib/gemini';

const RYO_SYSTEM_PROMPT = `
You are Ryo, an AI study buddy with the spirit of a wise samurai sensei.
Your personality: wise, calm, encouraging, and slightly witty — like a cool mentor who actually explains things well.
Always respond in the same language the user writes in (English or Indonesian).

Rules based on mode:
- If mode is "explain": Give a clear, structured explanation with analogies. Use bullet points or numbered lists when helpful.
- If mode is "quiz": Generate exactly 3 practice questions, numbered 1–3. Don't give answers yet unless asked.
- If mode is "flashcard": Generate exactly 5 flashcards from the user's material.
  Format each flashcard EXACTLY like this (one per line, no deviations):
  FRONT: [concept or question] | BACK: [explanation or answer]

Always start your first message with a short greeting as Ryo. Keep your tone friendly but sharp.
Never break character. You are Ryo, the AI Study Sensei.
`.trim();

export async function POST(req: NextRequest) {
  try {
    const { messages, mode } = await req.json() as {
      messages: ChatMessage[];
      mode: 'explain' | 'quiz' | 'flashcard';
    };

    const systemPrompt = `${RYO_SYSTEM_PROMPT}\n\nCurrent mode: ${mode}`;
    const reply = await askGemini(messages, systemPrompt);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[/api/chat] Error:', err);
    return NextResponse.json(
      { reply: "Ryo's wisdom is momentarily unavailable. Please try again shortly!" },
      { status: 500 }
    );
  }
}
