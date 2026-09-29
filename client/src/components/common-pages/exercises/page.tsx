"use client";

import Link from "next/link";
import { ArrowLeft, Dumbbell, Orbit, Terminal, Activity, Eye } from "lucide-react";
import { EXERCISE_CATEGORIES } from "./exerciseData";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Footer from "@/layouts/Footer";

export default function ExercisesPage() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Tracks cursor position across coordinates to drive the custom flashy engine layout
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative min-h-dvh w-full bg-[#0a0a0c] text-neutral-200 overflow-x-hidden font-mono selection:bg-red-700 selection:text-white lg:cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── CUSTOM CURSOR ASSEMBLY (Barbell Icon + Flashy Plasma Glow) ── */}
      {isHovered && (
        <>
          {/* Flashy Behind-The-Cursor High-Density Aura */}
          <div
            className="pointer-events-none fixed z-50 w-24 h-24 bg-red-600/20 rounded-full blur-xl mix-blend-screen -translate-x-1/2 -translate-y-1/2 hidden lg:block transition-transform duration-75 ease-out"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
          {/* Main Interactive Crosshair Barbell Core */}
          <div
            className="pointer-events-none fixed z-50 p-2 bg-white rounded-full text-black shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center transition-transform duration-0"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          >
            <Dumbbell size={14} className="rotate-45 animate-pulse" />
          </div>
        </>
      )}

      {/* ── SCI-FI CINEMATIC BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-neutral-900/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* ── TOPBAR ── */}
      <header className="relative z-30 bg-[#0c0c0e]/80 border-b border-neutral-900 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-900/40 border border-neutral-800/80 hover:border-red-600/50 hover:bg-neutral-900/80 transition-all duration-300 shadow-inner group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Terminal_Return
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <Dumbbell size={14} className="text-white" />
              </div>
              <span className="font-black text-white text-base tracking-tighter uppercase hidden sm:block">
                Vector<span className="text-red-600">.Matrix</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-widest text-neutral-500 font-bold uppercase bg-black/40 border border-neutral-800 px-3 py-1.5 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
            {EXERCISE_CATEGORIES.length} Arrays Loaded
          </div>

        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

        {/* Experimental Sci-Fi Headline Structure */}
        <div className="relative border-b border-neutral-900 pb-6">
          <div className="absolute top-0 right-0 text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em] hidden md:block">
            SYS_LOC // EXERCISE_CATALOGUE
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-red-500 uppercase font-black mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse text-red-600" />
            Data Extraction Interface
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white font-serif italic">
            Exercise <span className="text-red-600 not-italic font-sans">Categories.</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-sans leading-relaxed">
            Initialize vector tracking sequences. Pick a designated body structural unit array to extract targeted drill protocols and real-time execution parameters.
          </p>
        </div>


        {/* ── DYNAMIC DESIGN HOVER GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EXERCISE_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              className="relative"
            >
              <Link
                href={`/exercises/${category.id}`}
                // {/* ADDED cursor-none AND lg:cursor-none HERE TO SUPPRESS DEFAULT BROWSER HOVER POINTERS */}
                className="group h-full bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl border border-neutral-850 shadow-lg hover:border-red-900/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.12)] transition-all duration-300 overflow-hidden flex flex-col w-full cursor-none lg:cursor-none"
              >
                {/* Visual Simulation Frame */}
                <div className="relative w-full aspect-video overflow-hidden bg-black/40 border-b border-neutral-900 cursor-none lg:cursor-none">
                  <img
                    src={category.imageUrl}
                    alt={category.title}
                    // {/* FORCE IMAGE TAG TO DROP ALL INTERACTIVE CURSORS */}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 cursor-none lg:cursor-none"
                    loading="lazy"
                  />
                  {/* High contrast custom grid overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-90 pointer-events-none" />
                  <div className="absolute top-2 left-2 text-[8px] font-bold text-neutral-500 bg-black/60 px-1.5 py-0.5 border border-neutral-800 rounded uppercase tracking-wider pointer-events-none">
                    CH_{String(category.id).toUpperCase().slice(0, 4)}
                  </div>
                </div>

                {/* Tactile Information Panel */}
                <div className="flex flex-col gap-2 p-5 flex-1 relative cursor-none lg:cursor-none">
                  {/* Lateral Activation Indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-transparent group-hover:bg-red-600 transition-colors pointer-events-none" />

                  <h2 className="font-bold text-white text-base tracking-tight group-hover:text-red-500 transition-colors uppercase pointer-events-none">
                    {category.title}
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-3 pointer-events-none">
                    {category.description}
                  </p>

                  {/* Action Link Anchor */}
                  <div className="mt-auto pt-4 border-t border-neutral-900/60 flex items-center justify-between text-xs font-bold text-red-500 pointer-events-none">
                    <span className="tracking-widest group-hover:text-white transition-colors uppercase text-[10px]">
                      Initialize_Extract
                    </span>
                    <Eye size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}