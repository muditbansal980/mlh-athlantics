import React, { useEffect, useState } from 'react';

interface SportyLoaderProps {
  onComplete?: () => void;
}

export default function SportyLoader({ onComplete }: SportyLoaderProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        // Random incremental jumps for a more realistic feel
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 overflow-hidden select-none">
      
      {/* Sporty Background Aesthetics: Speed Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-40 h-1 bg-cyan-400 blur-sm transform skew-x-12 animate-[pulse_1.5s_infinite]"></div>
        <div className="absolute top-1/2 -right-10 w-60 h-1 bg-orange-500 blur-sm transform -skew-x-12 animate-[pulse_2s_infinite]"></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-1 bg-yellow-400 blur-sm transform skew-x-12"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        
        {/* Animated Sporty Icon (Stopwatch/Timer Concept) */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute w-24 h-24 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin duration-1000"></div>
          
          {/* Inner Core Icon */}
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <svg 
              className="w-8 h-8 text-orange-500 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24"
            >
              {/* Lightning Bolt / Energy Icon */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
        </div>

        {/* Sporty Typography */}
        <h1 className="text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-cyan-400 uppercase drop-shadow-md">
          Get Ready
        </h1>
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mt-1 mb-8 animate-pulse">
          Optimizing Performance...
        </p>

        {/* Racing Style Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-4 p-0.5 overflow-hidden shadow-inner transform -skew-x-12">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(249,115,22,0.6)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="mt-3 font-mono font-black italic text-lg text-cyan-400 flex items-center gap-1">
          <span>{Math.min(progress, 100)}</span>
          <span className="text-xs text-slate-500 font-bold">%</span>
        </div>

      </div>

      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.2)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
    </div>
  );
}