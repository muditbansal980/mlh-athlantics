"use client";

import Link from "next/link";
import Image from "next/image"; // Guaranteed Next.js import tracking
import { ArrowLeft, Dumbbell, Activity, Eye, Zap, Clock } from "lucide-react";
import { HOME_WORKOUT_EXERCISES } from "../../exercisecategoriesdata/home-workout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomeWorkoutPage() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  // Tracks cursor coordinates to drive custom layout glow engine
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
      {/* ── CUSTOM CURSOR ASSEMBLY ── */}
      {isHovered && (
        <>
          <div
            className="pointer-events-none fixed z-50 w-24 h-24 bg-red-600/20 rounded-full blur-xl mix-blend-screen -translate-x-1/2 -translate-y-1/2 hidden lg:block transition-transform duration-75 ease-out"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
          <div
            className="pointer-events-none fixed z-50 p-2 bg-white rounded-full text-black shadow-[0_0_15px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center transition-transform duration-0"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          >
            <Dumbbell size={14} className="rotate-45 animate-pulse" />
          </div>
        </>
      )}

      {/* ── BACKGROUND LAYER MATRICES ── */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-red-900/10 rounded-full blur-[130px] mix-blend-screen pointer-events-none animate-pulse" />

      {/* ── TOPBAR ── */}
      <header className="relative z-30 bg-[#0c0c0e]/80 border-b border-neutral-900 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/exercises"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-900/40 border border-neutral-800/80 hover:border-red-600/50 hover:bg-neutral-900/80 transition-all duration-300 shadow-inner group cursor-none lg:cursor-none"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Catalogue_Return
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <span className="font-black text-white text-base tracking-tighter uppercase hidden sm:block">
                Base<span className="text-red-600">_Protocol</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-widest text-neutral-500 font-bold uppercase bg-black/40 border border-neutral-800 px-3 py-1.5 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
            {HOME_WORKOUT_EXERCISES.length} Core Routines Active
          </div>
        </div>
      </header>

      {/* ── MAIN CONTAINER ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">
        <div className="relative border-b border-neutral-900 pb-6">
          <div className="absolute top-0 right-0 text-[9px] text-neutral-600 font-bold uppercase tracking-[0.3em] hidden md:block">
            MATRIX // VOL_1.0_HOME
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-red-500 uppercase font-black mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse text-red-600" />
            Autonomous Sector Training
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white font-serif italic">
            Home <span className="text-red-600 not-italic font-sans">Workouts.</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-sans leading-relaxed">
            Zero equipment required. Deploying targeted conditioning programs optimized for local environments and full spatial bodyweight mastery.
          </p>
        </div>

        {/* ── EXERCISE MATRIX GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {HOME_WORKOUT_EXERCISES.map((exercise, idx) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              className="relative"
            >
              {/* FIXED border-neutral-855 -> changed to standard border-neutral-800 */}
              <Link
                href={exercise.redirectUrl}
                className="group h-full bg-[#0c0c0e]/80 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-lg hover:border-red-900/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.12)] transition-all duration-300 overflow-hidden flex flex-col w-full cursor-none lg:cursor-none"
              >
                {/* Parent wrapper has relative + layout heights to let Image fill correctly */}
                <div className="relative w-full aspect-video h-48 sm:h-40 overflow-hidden bg-black/40 border-b border-neutral-900 cursor-none lg:cursor-none">
                  {exercise.imageUrl ? (
                    <Image
                      src={exercise.imageUrl}
                      alt={exercise.title}
                      fill
                      sizes="(max-w-7xl) 25vw, 50vw"
                      className="object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 cursor-none lg:cursor-none"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600 text-xs">
                      No Vector Asset Found
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-90 pointer-events-none" />
                  <div className="absolute top-2 left-2 z-10 text-[8px] font-bold text-neutral-400 bg-black/70 px-2 py-0.5 border border-neutral-800 rounded uppercase tracking-wider pointer-events-none">
                    {exercise.metadata?.difficulty || "STANDARD"}
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-5 flex-1 relative cursor-none lg:cursor-none">
                  <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-transparent group-hover:bg-red-600 transition-colors pointer-events-none" />
                  <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest pointer-events-none">
                    Target: {exercise.metadata?.targetMuscle || "N/A"}
                  </div>
                  <h2 className="font-bold text-white text-base tracking-tight group-hover:text-red-500 transition-colors uppercase pointer-events-none">
                    {exercise.title}
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2 pointer-events-none">
                    {exercise.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-neutral-500 font-bold mt-2 pt-2 border-t border-neutral-900/40 pointer-events-none">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-red-500" />
                      {exercise.metadata?.estimatedDuration || "30s"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={11} className="text-neutral-400" />
                      {exercise.metadata?.recommendedRepetitions || "Reps"}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-900/60 flex items-center justify-between text-xs font-bold text-red-500 pointer-events-none">
                    <span className="tracking-widest group-hover:text-white transition-colors uppercase text-[10px]">
                      Execute_Drill
                    </span>
                    <Eye size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}