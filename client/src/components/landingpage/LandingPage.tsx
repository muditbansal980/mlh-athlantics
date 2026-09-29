"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JugglingRobotCanvas from "../../../libs/JugglingRobot";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config/app";
import SuccessPopup from "./successfulpopup";
import {
  Send,
  CheckCircle2,
  MessageSquareHeart,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  FEATURES,
  VIDEO_STEPS,
  STREAK_MILESTONES,
  FAQS,
  STATS,
  NAV_LINKS,
} from "./landingdata";

import { Variants } from "framer-motion";

// --- ANIMATION VARIANTS ---
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } // This works perfectly now
  }
};

const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const [message, setMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  // Prevent Hydration Mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function handleSubmit() {
    if (!message.trim()) return;
    const res = await fetch(`${BACKEND_URL}/api/feedback/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });
    if (res.ok) {
      setSuccessOpen(true);
      setMessage("");
    }
  }
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [demoPhase, setDemoPhase] = useState<"idle" | "uploading" | "analysing" | "done">("idle");
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoPoints, setDemoPoints] = useState(0);
  const [demoRank, setDemoRank] = useState(142);
  const [demoStreak, setDemoStreak] = useState(6);

  const runDemo = () => {
    if (demoPhase !== "idle") {
      setDemoPhase("idle");
      setDemoProgress(0);
      setDemoPoints(0);
      setDemoRank(142);
      setDemoStreak(6);
      return;
    }
    setDemoPhase("uploading");
    let p = 0;
    const uploadInterval = setInterval(() => {
      p += 5;
      setDemoProgress(p);
      if (p >= 100) {
        clearInterval(uploadInterval);
        setDemoPhase("analysing");
        setTimeout(() => {
          setDemoPhase("done");
          setDemoRank(87);
          setDemoStreak(7);
          let pts = 0;
          const pointsInterval = setInterval(() => {
            pts += 10;
            setDemoPoints(pts);
            if (pts >= 340) clearInterval(pointsInterval);
          }, 20);
        }, 2000);
      }
    }, 50);
  };

  if (!hasMounted) return <div className="min-h-dvh bg-white" />;

  return (
    <main className="relative min-h-dvh bg-[#EEEDED] text-[#201C1C] overflow-x-hidden font-sans selection:bg-[#EA3A3A] selection:text-white">
      <SuccessPopup open={successOpen} onClose={() => setSuccessOpen(false)} />
      {/* ── KINETIC BACKGROUND ────────────────────────────────────── */}
      <motion.div
        style={{ scale: backgroundScale }}
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EA3A3A]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[50%] bg-[#EA3A3A]/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-[100] backdrop-blur-xl bg-white/70 border-b border-[#201C1C]/5">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EA3A3A] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-[#EA3A3A]/20 group-hover:rotate-12 transition-transform">
              A
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">
              Athlan<span className="text-[#EA3A3A]">tic</span>
            </span>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-xs font-bold uppercase tracking-widest text-[#201C1C]/60 hover:text-[#EA3A3A] transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/register" className="hidden sm:block text-xs font-bold uppercase tracking-widest px-6 py-3 hover:text-[#EA3A3A] transition-colors">
              Log In
            </Link>
            <Link href="/register" className="text-xs font-bold uppercase tracking-widest bg-[#201C1C] text-white  px-4 lg:px-8 py-4 rounded-full hover:bg-[#EA3A3A] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-[#201C1C]/10">
              Join The Grid
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-24 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:block w-full"
        >
          {/* The Neon Core Background Shadows */}
          <div className="w-[450px] h-[450px] bg-[#EA3A3A] rounded-[40px] rotate-6 absolute inset-0 opacity-10 blur-3xl pointer-events-none" />

          {/* The Container Border framing the Canvas */}
          <div className="relative border-2 border-[#201C1C]/10 bg-white/40 backdrop-blur-md p-4 rounded-[40px] shadow-[20px_20px_0px_#201C1C]">
            <JugglingRobotCanvas />
          </div>
        </motion.div>
        <div className="max-w-6xl mt-12 mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-left"
          >

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl mt-2 font-black text-[#201C1C] tracking-tighter leading-[0.9] mb-8 uppercase">
              REDEFINE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA3A3A] to-[#201C1C]">YOUR LIMITS.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-[#201C1C]/60 text-lg max-w-lg mb-12 leading-relaxed font-medium">
              The world's most aggressive AI activity verifier. Upload, earn, and dominate the global rankings.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <button onClick={() => router.push("/register")} className="px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white bg-[#EA3A3A] hover:bg-[#201C1C] transition-all shadow-2xl shadow-[#EA3A3A]/30 flex items-center gap-3 group">
                Initialize Training
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="w-[500px] h-[500px] bg-[#EA3A3A] rounded-[40px] rotate-12 absolute inset-0 opacity-5 blur-3xl animate-pulse" />
            <div className="relative border-4 border-[#201C1C] bg-white p-8 rounded-[40px] shadow-[30px_30px_0px_#EA3A3A] transform -rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="space-y-6">
                {STATS.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[#201C1C]/5 pb-4">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-40">{stat.label}</span>
                    <span className="text-3xl font-black text-[#EA3A3A]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#201C1C]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#EA3A3A] text-[10px] font-black tracking-[0.3em] uppercase mb-4 block">Core Modules</span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                BUILT FOR THE <br /><span className="text-[#EA3A3A]">1% OF ATHLETES.</span>
              </h2>
            </div>
            <p className="text-white/40 max-w-xs font-medium text-sm leading-relaxed">
              Industrial grade performance tracking and AI verification for every rep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -10 }}
                className="bg-[#2b2626] rounded-3xl p-10 border border-white/5 group hover:border-[#EA3A3A]/40 transition-all duration-500"
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 block">{feature.icon}</div>
                <h3 className="font-black text-white text-2xl mb-4 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[#EA3A3A] text-[10px] font-black uppercase tracking-widest mb-6">
                  {feature.slogan}
                </p>
                <p className="text-white/40 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO (ULTRA INTERACTIVE) ────────────────────────── */}
      {/* <section id="how-it-works" className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">THE AI <span className="italic text-[#EA3A3A]">LAB</span></h2>
            <p className="text-[#201C1C]/40 font-bold uppercase text-xs tracking-[0.2em]">Live activity verification engine</p>
          </div>

          <motion.div
            layout
            className="relative bg-white p-4 sm:p-8 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-[#201C1C]/5"
          >
            <div className="relative aspect-video bg-[#201C1C] rounded-[30px] overflow-hidden group">
              <AnimatePresence mode="wait">
                {demoPhase === "analysing" && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-[#EA3A3A]/20 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 border-[6px] border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-white font-black tracking-[0.4em] uppercase text-xs">Mapping Joints...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 flex items-center justify-center">
                {demoPhase === "idle" && <span className="text-white/20 font-black text-8xl italic uppercase select-none">READY</span>}
                {demoPhase === "done" && <motion.span initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="text-[#EA3A3A] font-black text-9xl">VERIFIED</motion.span>}
              </div>

              // Progress Bar 
              {demoPhase === "uploading" && (
                <div className="absolute bottom-0 left-0 h-2 bg-[#EA3A3A] transition-all duration-300" style={{ width: `${demoProgress}%` }} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-[#EEEDED] p-8 rounded-3xl text-center border-2 border-transparent hover:border-[#EA3A3A]/20 transition-all">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">XP Protocol</p>
                <p className="text-4xl font-black text-[#EA3A3A]">+{demoPoints}</p>
              </div>
              <div className="bg-[#EEEDED] p-8 rounded-3xl text-center border-2 border-transparent hover:border-[#EA3A3A]/20 transition-all">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">Global Standing</p>
                <p className="text-4xl font-black text-[#201C1C]">#{demoRank}</p>
              </div>
              <div className="bg-[#EEEDED] p-8 rounded-3xl text-center border-2 border-transparent hover:border-[#EA3A3A]/20 transition-all">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">Heat Level</p>
                <p className="text-4xl font-black text-[#EA3A3A]">{demoStreak}D</p>
              </div>
            </div>

            <button
              onClick={runDemo}
              className="mt-8 w-full py-6 bg-[#201C1C] text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-[#EA3A3A] transition-all transform active:scale-[0.98]"
            >
              {demoPhase === "idle" ? "INITIATE SCAN" : demoPhase === "done" ? "RESET SYSTEM" : "PROCESSING..."}
            </button>
          </motion.div>
        </div>
      </section> */}

      //Feedback form
      <section
      id="feedback"
      className="relative py-32 overflow-hidden bg-[#201C1C]"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#EA3A3A]/15 blur-[180px]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_520px] gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EA3A3A]/30 bg-[#EA3A3A]/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#EA3A3A]">
              <Sparkles size={14} />
              Community Feedback
            </div>

            <h2 className="mt-8 text-5xl md:text-7xl font-black uppercase leading-none tracking-tight text-white">
              BUILD THE
              <br />
              <span className="text-[#EA3A3A]">FUTURE</span>
              <br />
              WITH US.
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/60">
              Every message is read personally. Tell us what feels amazing,
              what's confusing, or which feature would make Athlantic your
              favorite sports platform.
            </p>

            <div className="mt-12 space-y-5">
              {[
                "✓ Completely anonymous",
                "✓ No email required",
                "✓ Suggestions directly improve future releases",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 text-white/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EA3A3A]/10">
                    <MessageSquareHeart
                      size={18}
                      className="text-[#EA3A3A]"
                    />
                  </div>

                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-2 rounded-[36px] bg-[#EA3A3A]/20 blur-2xl" />

            <div className="relative rounded-[36px] border border-white/10 bg-[#272222] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#EA3A3A]">
                    Anonymous
                  </p>

                  <h3 className="mt-2 text-3xl font-black uppercase text-white">
                    Share Feedback
                  </h3>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EA3A3A] shadow-xl shadow-[#EA3A3A]/30">
                  <MessageSquareHeart
                    size={30}
                    className="text-white"
                  />
                </div>
              </div>

              {!submitted ? (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    maxLength={800}
                    placeholder="Tell us what should be improved...

Examples:
• New features you'd like.
• UI suggestions.
• Bugs you've found.
• Things you loved."
                    className="w-full resize-none rounded-3xl border border-white/10 bg-[#201C1C] p-6 text-base text-white placeholder:text-white/30 outline-none transition-all focus:border-[#EA3A3A]"
                  />

                  <div className="mt-3 flex justify-end text-xs uppercase tracking-widest text-white/30">
                    {message.length}/800
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#EA3A3A] py-5 text-sm font-black uppercase tracking-[0.25em] text-white transition-all hover:scale-[1.02] hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={18} />
                    Send Anonymous Feedback
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-[360px] flex-col items-center justify-center text-center"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2
                      size={60}
                      className="text-green-400"
                    />
                  </div>

                  <h4 className="mt-8 text-3xl font-black uppercase text-white">
                    Feedback Received
                  </h4>

                  <p className="mt-4 max-w-sm text-white/60">
                    Thank you for helping improve Athlantic. Your suggestion has
                    been received anonymously.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-[#EEEDED] pt-32 pb-12 px-6 border-t border-[#201C1C]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 mb-32">
            <div>
              <h3 className="text-6xl font-black tracking-tighter uppercase mb-12">ANSWERS <br /> TO THE <span className="text-[#EA3A3A]">GRID.</span></h3>
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <div key={faq.id} className="group">
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className="w-full text-left py-6 border-b border-[#201C1C]/10 flex justify-between items-center"
                    >
                      <span className="font-black text-lg uppercase tracking-tight group-hover:text-[#EA3A3A] transition-colors">{faq.question}</span>
                      <span className={`text-2xl transition-transform duration-500 ${openFaq === faq.id ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence>
                      {openFaq === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="py-6 text-[#201C1C]/60 font-medium leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#201C1C] p-12 rounded-[40px] text-white flex flex-col justify-between items-start self-start">
              <div className="w-full">
                <span className="text-[#EA3A3A] text-[10px] font-black tracking-[0.4em] uppercase mb-6 block">Support Protocol</span>
                <h4 className="text-4xl font-black tracking-tight uppercase mb-8">Uplink Unstable? <br /> Ask an Engineer.</h4>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white focus:border-[#EA3A3A] transition-colors outline-none font-bold uppercase tracking-widest text-xs"
                    placeholder="ENTER QUERY..."
                  />
                  {/* <button onClick={handleQuestionSubmit} className="mt-4 w-full bg-[#EA3A3A] py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-[#EA3A3A] transition-all">Send Uplink</button> */}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-[#201C1C]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#201C1C] flex items-center justify-center font-black text-[#EA3A3A] text-lg">A</div>
              <span className="font-black text-xl tracking-tighter uppercase">Athlantic</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-[#201C1C]/40">
              <a href="#" className="hover:text-[#EA3A3A]">Privacy</a>
              <a href="#" className="hover:text-[#EA3A3A]">Terms</a>
              <a href="#" className="hover:text-[#EA3A3A]">Uptime</a>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#201C1C]/20">© 2026 PROTOCOL</p>
          </div>
        </div>
      </footer>
    </main>
  );
}