"use client";
import LeaderboardDashboard from "@/components/common-pages/leaderboard/leaderboard";
// app/leaderboard/page.tsx

import { Suspense } from "react";
import { Loader2 } from "lucide-react";


export default function LeaderboardPage() {
  return (
    // Next.js safely defers this component to client-side rendering
    <Suspense 
      fallback={
        <div className="min-h-dvh w-full bg-white flex flex-col items-center justify-center gap-2 font-mono">
          <Loader2 className="w-8 h-8 animate-spin text-red-700" />
          <p className="text-xs uppercase text-neutral-400 tracking-widest">Initializing Dashboard...</p>
        </div>
      }
    >
      <LeaderboardDashboard />
    </Suspense>
  );
}