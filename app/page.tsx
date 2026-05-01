"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { BookOpen, Zap, Layers } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const features = [
  {
    icon: <BookOpen size={28} />,
    title: "Ask Anything",
    desc: "From quantum physics to world history — Ryo explains every topic with clarity and helpful analogies.",
  },
  {
    icon: <Zap size={28} />,
    title: "Generate Quizzes",
    desc: "Switch to Quiz mode and Ryo instantly creates 3 practice questions on any topic to test your understanding.",
  },
  {
    icon: <Layers size={28} />,
    title: "Build Flashcards",
    desc: "Paste your study material and Ryo transforms it into interactive flip-cards you can use for rapid revision.",
  },
];

export default function Home() {
  return (
    <main
      style={{ background: "var(--bg)", minHeight: "100vh" }}
      className="overflow-x-hidden"
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          background: "rgba(8,13,26,0.85)",
          backdropFilter: "blur(12px)",
        }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="StudySage logo" width={36} height={36} className="rounded" />
          <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            StudySage
          </span>
        </div>
        <Link href="/chat" id="nav-cta">
          <button className="btn-primary text-sm">Chat with Ryo →</button>
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-6 pt-16 pb-24 gap-12">
        {/* Glow blob */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Left — Text */}
        <div className="flex-1 z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
          >
            <span
              className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-6"
              style={{ background: "var(--primary-glow)", color: "var(--primary)", border: "1px solid var(--primary-dim)" }}
            >
              ⚔️ Powered by Google Gemini
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            initial="hidden" animate="show" variants={fadeUp} custom={1}
          >
            Meet <span className="gradient-text">Ryo</span>,<br />
            Your AI Study<br />Sensei
          </motion.h1>

          <motion.p
            className="text-lg mb-10 max-w-lg"
            style={{ color: "var(--text-muted)" }}
            initial="hidden" animate="show" variants={fadeUp} custom={2}
          >
            Ask questions, generate practice quizzes, or turn your study notes into flashcards —
            Ryo is always ready to help you study smarter.
          </motion.p>

          <motion.div
            className="flex gap-4 flex-wrap"
            initial="hidden" animate="show" variants={fadeUp} custom={3}
          >
            <Link href="/chat" id="hero-cta-primary">
              <button className="btn-primary text-base px-8 py-4">
                Start Studying with Ryo →
              </button>
            </Link>
            <a
              href="#features"
              id="hero-cta-secondary"
              className="inline-flex items-center px-8 py-4 rounded-lg font-semibold text-base transition-colors"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-dim)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              See Features
            </a>
          </motion.div>
        </div>

        {/* Right — Ryo */}
        <motion.div
          className="flex-1 flex justify-center z-10"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="relative animate-float"
            style={{
              borderRadius: "24px",
              padding: "4px",
              background: "linear-gradient(135deg, var(--primary-dim), transparent)",
            }}
          >
            <div
              className="animate-pulse-glow"
              style={{ borderRadius: "22px", overflow: "hidden" }}
            >
              <Image
                src="/ryo-avatar.png"
                alt="Ryo — AI Study Sensei"
                width={380}
                height={380}
                className="object-cover"
                priority
              />
            </div>
            {/* Badge */}
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
              style={{ background: "var(--primary)", color: "#080D1A" }}
            >
              ⚔️ Ryo — AI Study Sensei
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-28">
        <motion.h2
          className="text-3xl font-bold text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What <span className="gradient-text">Ryo</span> Can Do
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "var(--primary-glow)", color: "var(--primary)" }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: "1.7" }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <motion.div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "linear-gradient(135deg, var(--bg-surface), var(--accent))",
            border: "1px solid var(--primary-dim)",
            boxShadow: "0 0 60px var(--primary-glow)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to study <span className="gradient-text">smarter</span>?
          </h2>
          <p style={{ color: "var(--text-muted)" }} className="mb-8 text-lg">
            Ryo is waiting. No sign-up needed — just start chatting.
          </p>
          <Link href="/chat" id="cta-banner-btn">
            <button className="btn-primary text-lg px-10 py-4">
              Open Chat with Ryo ⚔️
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="text-center py-8 text-sm"
        style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}
      >
        © 2026 StudySage — Built with Next.js & Google Gemini · Character: Ryo the AI Sensei
      </footer>
    </main>
  );
}
