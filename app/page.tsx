"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { BookOpen, Zap, Layers, ArrowRight } from "lucide-react";

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
    icon: <BookOpen size={24} />,
    title: "Explain Anything",
    desc: "From quantum physics to world history — Ryo explains every topic with clarity and helpful analogies.",
  },
  {
    icon: <Zap size={24} />,
    title: "Generate Quizzes",
    desc: "Switch to Quiz mode and Ryo instantly creates practice questions on any topic to test your understanding.",
  },
  {
    icon: <Layers size={24} />,
    title: "Smart Flashcards",
    desc: "Paste your study material and Ryo transforms it into interactive 3D flip-cards for rapid revision.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-gradient)] text-[var(--text-light)] font-sans selection:bg-[var(--cream)] selection:text-[var(--text-dark)] flex flex-col">
      {/* ── Navbar ── */}
      <nav className="w-full flex items-center justify-between px-8 py-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex gap-0.5">
            <div className="w-4 h-8 bg-[var(--cream)] rounded-l-full"></div>
            <div className="w-4 h-8 bg-[var(--cream)] rounded-r-full opacity-60"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--cream)]">
            StudySage
          </span>
        </div>
        <Link href="/chat">
          <button className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 bg-white/10 hover:bg-white/20 border border-[var(--border-color)]">
            Go to App
          </button>
        </Link>
      </nav>

      {/* ── Hero Section ── */}
      <section className="flex-1 flex flex-col-reverse lg:flex-row items-center justify-center max-w-7xl mx-auto px-8 py-12 lg:py-20 gap-16 lg:gap-24 relative w-full">
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--cream)]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start z-10 max-w-2xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-[var(--border-color)] bg-[var(--purple-dark)]/50 text-[var(--text-muted)] text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--cream)] animate-pulse" />
              Powered by Google Gemini & Text-to-Speech
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
            initial="hidden" animate="show" variants={fadeUp} custom={1}
          >
            Study smarter with <span className="text-[var(--cream)]">Ryo.</span>
          </motion.h1>

          <motion.p 
            className="text-lg lg:text-xl mb-10 text-[var(--text-muted)] leading-relaxed max-w-xl"
            initial="hidden" animate="show" variants={fadeUp} custom={2}
          >
            Your elegant, AI-powered study buddy. Ask questions, generate practice quizzes, and flip interactive flashcards in a distraction-free dark workspace.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial="hidden" animate="show" variants={fadeUp} custom={3}
          >
            <Link href="/chat">
              <button className="btn-cream px-8 py-4 flex items-center gap-2 text-base shadow-lg shadow-[var(--cream)]/10 hover:shadow-[var(--cream)]/20 transition-all">
                Start Studying Free <ArrowRight size={18} />
              </button>
            </Link>
            <a href="#features" className="px-8 py-4 rounded-full font-medium text-[var(--text-light)] bg-[var(--purple-dark)] border border-[var(--border-color)] hover:bg-white/5 transition-all text-center">
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Right Content - Mockup Avatar */}
        <motion.div 
          className="relative z-10 w-full max-w-sm lg:max-w-md"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="avatar-glow relative aspect-square rounded-[3rem] overflow-hidden border border-[var(--border-color)] bg-[var(--purple-dark)]/50 shadow-2xl backdrop-blur-sm p-4">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-[var(--bg-gradient)] relative">
              <Image 
                src="/ryo-avatar.png" 
                alt="Ryo - Study Sensei" 
                fill 
                className="object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-500 scale-105" 
                priority
              />
              {/* Fake UI overlays on the avatar container to show it's an app */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--cream)] text-[var(--text-dark)] px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> AI Sensei Online
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="w-full bg-[var(--purple-dark)]/30 border-t border-[var(--border-color)] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                className="bg-[var(--purple-dark)]/50 border border-[var(--border-color)] p-8 rounded-3xl hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--cream)] text-[var(--text-dark)] flex items-center justify-center mb-6 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full text-center py-8 text-[var(--text-muted)] text-sm border-t border-[var(--border-color)] relative z-10 bg-[var(--bg-gradient)]">
        <p>© {new Date().getFullYear()} StudySage. Built with Next.js, Framer Motion & Google Gemini.</p>
      </footer>
    </main>
  );
}
