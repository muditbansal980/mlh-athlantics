{/* ─── DYNAMIC ACTIVITY SECTION (ISOLATED MARQUEE HORIZONTAL LOOPS) ─── */}
<section className="relative bg-[#09090b]/80 border border-neutral-900 py-6 rounded-2xl backdrop-blur-md overflow-hidden">
  
  {/* Scoped Keyframe Injection - Guarantees zero leakage to other pages */}
  <style jsx global>{`
    @keyframes localProfileMarquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-profile-marquee {
      animation: localProfileMarquee 25s linear infinite;
    }
  `}</style>

  <div className="px-6 sm:px-8 border-b border-neutral-900 pb-4 mb-5">
    <h2 className="text-xs font-black tracking-[0.3em] text-neutral-400 uppercase flex items-center gap-2">
      <Activity size={14} className="text-red-600 animate-pulse" /> Live_Telemetry_Feeds
    </h2>
  </div>

  {/* Masked Horizontal Overflow Window Container */}
  <div className="relative w-full overflow-x-auto scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-red-900/50 flex gap-4 px-6 sm:px-8 pb-3">
    
    {/* Infinite Stream Execution Loop using the Scoped Class */}
    <div className="flex gap-4 animate-profile-marquee hover:[animation-play-state:paused] whitespace-nowrap shrink-0">
      {[...publicActivities, ...publicActivities].map((act, index) => (
        <div 
          key={`${act.id}-${index}`}
          className="inline-block w-64 p-4 bg-neutral-950 border border-neutral-900 rounded-xl hover:border-red-600/40 transition-colors shrink-0"
        >
          <div className="flex items-center justify-between text-[8px] font-black tracking-wider uppercase mb-1.5">
            <span className="text-red-500 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30">
              {act.category}
            </span>
            <span className="text-neutral-600 font-mono">{act.date}</span>
          </div>
          <p className="text-xs font-bold text-white uppercase tracking-tight truncate">
            {act.title}
          </p>
        </div>
      ))}
    </div>

  </div>
  <div className="px-6 sm:px-8 text-[9px] text-neutral-600 font-bold uppercase tracking-wider mt-1">
    * Shift-scroll or drag window horizontally to override system automation pacing.
  </div>
</section>
export default {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(100%)",
          },
        },
      },

      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
};