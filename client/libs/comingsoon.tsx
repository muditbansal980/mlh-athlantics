"use client";

import React, { useState } from 'react';

interface ComingSoonProps {
  titleText?: string;
  subtitleText?: string;
}

export default function ComingSoon({
  titleText = "THE NEXT EVOLUTION",
  subtitleText = "Something intense is brewing."
}: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div className="relative min-h-dvh w-full bg-[#201C1C] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      
      {/* INJECTED CSS ANIMATIONS */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(4rem); }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-grid-drift {
          animation: gridMove 24s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounceSlow 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* BACKGROUND DESIGN SYSTEM */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Animated Cyber Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#332c2c_1px,transparent_1px),linear-gradient(to_bottom,#332c2c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 animate-grid-drift"
        />

        {/* Ambient Crimson Glow Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] sm:w-[50rem] h-[30rem] bg-[#EA3A3A]/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#EA3A3A]/5 rounded-full blur-[80px] animate-bounce-slow" />
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full max-w-2xl text-center space-y-6 sm:space-y-8 opacity-0 animate-fade-in-up">
        
        {/* Minimal Crimson Icon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EA3A3A]/10 border border-[#EA3A3A]/30 text-[#EA3A3A] font-mono text-xs tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-[#EA3A3A] animate-ping" />
          Transmission Active
        </div>

        {/* Dynamic Title (Split Palette Look) */}
        <h1 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase leading-none text-[#EEEDED]">
          {titleText}
          <span className="block text-[#EA3A3A] mt-1 drop-shadow-[0_0_15px_rgba(234,58,58,0.3)]">
            COMING SOON
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p className="text-sm sm:text-lg text-[#EEEDED]/60 max-w-md mx-auto leading-relaxed font-light font-sans">
          {subtitleText}
        </p>
      </div>

      {/* STADIUM WHITE MINIMAL FOOTER */}
      <footer className="absolute bottom-6 font-mono text-[10px] sm:text-xs text-[#EEEDED]/30 tracking-widest uppercase z-10">
        &copy; {new Date().getFullYear()} CORE STADIUM / ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}