"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ShieldAlert, Activity, ExternalLink, 
  PlayCircle, BookOpen, ListOrdered, Dumbbell 
} from "lucide-react";
import { useEffect, useState } from "react";
import { DetailedExerciseSchema } from "../exercisecategoriespages/home-workout/home-workout-categories/data";

export default function ExerciseDetailSkeleton({ data }: { data: DetailedExerciseSchema }) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="relative min-h-dvh w-full bg-[#0a0a0c] text-neutral-200 overflow-x-hidden font-mono lg:cursor-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── CUSTOM CURSOR ── */}
      {isHovered && (
        <>
          <div
            className="pointer-events-none fixed z-50 w-24 h-24 bg-red-600/20 rounded-full blur-xl mix-blend-screen -translate-x-1/2 -translate-y-1/2 hidden lg:block transition-transform duration-75"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
          <div
            className="pointer-events-none fixed z-50 p-2 bg-white rounded-full text-black -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center shadow-[0_0_15px_white]"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          >
            <Dumbbell size={14} className="rotate-45 animate-pulse" />
          </div>
        </>
      )}

      {/* ── BACKGROUND DECOR ── */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      {/* ── TOPBAR ── */}
      <nav className="sticky top-0 z-40 bg-[#0c0c0e]/80 border-b border-neutral-900 backdrop-blur-md px-6 h-16 flex items-center">
        <Link 
          href="/exercises/home-workout" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors group cursor-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return_to_Matrix
        </Link>
      </nav>

      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* 1. CINEMATIC BANNER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
        >
          <Image 
            src={data.imageUrl} 
            alt={data.title} 
            fill 
            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
          
          {/* Floating HUD on Banner */}
          <div className="absolute bottom-8 left-8">
            <div className="flex items-center gap-2 text-red-500 text-[10px] tracking-[0.3em] font-black uppercase mb-2">
              <Activity size={14} className="animate-pulse" />
              Visual_Confirmation_Active
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter">
              {data.title}<span className="text-red-600 not-italic">.exe</span>
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Description & Steps */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 3. DESCRIPTION */}
            <section className="bg-[#0c0c0e]/60 border border-neutral-800 p-8 rounded-2xl backdrop-blur-xl">
              <h3 className="text-red-500 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                <ShieldAlert size={14} /> Description_Log
              </h3>
              <p className="text-neutral-400 leading-relaxed font-sans">
                {data.description}
              </p>
            </section>

            {/* 4. STEPS */}
            <section className="space-y-6">
              <h3 className="text-white text-sm font-black tracking-widest uppercase flex items-center gap-2">
                <ListOrdered size={18} className="text-red-600" /> Execution_Sequence
              </h3>
              <div className="space-y-4">
                {data.steps.map((step) => (
                  <motion.div 
                    key={step.number}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl group transition-colors hover:border-red-600/30"
                  >
                    <span className="text-2xl font-black text-neutral-700 group-hover:text-red-600 transition-colors">
                      {step.number.toString().padStart(2, '0')}
                    </span>
                    <p className="text-neutral-300 text-sm font-sans leading-relaxed self-center">
                      {step.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: References & Precautions */}
          <div className="space-y-8">
            
            {/* 6. PRECAUTIONS */}
            <section className="bg-red-950/10 border border-red-900/30 p-6 rounded-2xl">
              <h3 className="text-red-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                Critical_Safety_Parameters
              </h3>
              <ul className="space-y-3">
                {data.precautions.map((item, i) => (
                  <li key={i} className="text-xs text-neutral-400 flex gap-2">
                    <span className="text-red-600">▶</span> {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. REFERENCES */}
            <section className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl">
              <h3 className="text-white text-[10px] font-bold tracking-widest uppercase mb-6">
                External_Data_Nodes
              </h3>
              <div className="space-y-4">
                <a 
                  href={data.references.videoUrl} 
                  target="_blank" 
                  className="flex items-center justify-between p-3 bg-black rounded-lg border border-neutral-800 hover:border-red-600 transition-all group cursor-none"
                >
                  <span className="text-[10px] text-neutral-400 group-hover:text-white flex items-center gap-2">
                    <PlayCircle size={14} className="text-red-600" /> Video_Protocol
                  </span>
                  <ExternalLink size={12} className="text-neutral-600" />
                </a>
                <a 
                  href={data.references.blogUrl} 
                  target="_blank" 
                  className="flex items-center justify-between p-3 bg-black rounded-lg border border-neutral-800 hover:border-red-600 transition-all group cursor-none"
                >
                  <span className="text-[10px] text-neutral-400 group-hover:text-white flex items-center gap-2">
                    <BookOpen size={14} className="text-red-600" /> Documentation
                  </span>
                  <ExternalLink size={12} className="text-neutral-600" />
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}