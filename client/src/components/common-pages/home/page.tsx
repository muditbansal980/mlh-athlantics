"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, TrendingUp, Users, Trophy, BarChart2, ShoppingBag, Target } from "lucide-react";
import Footer from "../../../layouts/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { transformActivityData } from "@/components/utils/dashboard/chart";
import type { StreakData } from "../../../types/dashboard/streak";
import type { ProfileData } from "../../../types/dashboard/profile";
import type { Activity } from "../../../types/dashboard/activity";
import { fetchdashbaordData } from "../../../../api/dashboard/dashboard";
import {
  LEADERBOARD_PLAYERS,
  ACTIVITY_DATA,
} from "./dashboardData";

// import { useStreak } from "@/hooks/streak";

const staggerChassis: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.08 } }
};

const microCardFade: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } }
};

const timelineNode: Variants = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 160, damping: 22 } }
};

export default function HomePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [streakData, setStreakData] = useState<StreakData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitieschartData, setActivitiesChartData] = useState<{ day: string; uploads: number }[]>([]);
  const maxUploads = Math.max(...ACTIVITY_DATA.map((d) => d.uploads)) || 1;

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData = await fetchdashbaordData();
        if (dashboardData.error) {
          console.error(dashboardData.error);
          return;
        }
        if(dashboardData.status === 401){
          router.push("/login");
        }
        setActivities(dashboardData.Activities || []);
        setStreakData(dashboardData.Streak || []);
        setProfileData(dashboardData.Profile || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    function fetchActivities() {
      const chartdata : { day: string; uploads: number }[] = transformActivityData(activities);
      setActivitiesChartData(chartdata);                 
    }
    fetchActivities();
  }, [activities]);
  const displayPlayers = LEADERBOARD_PLAYERS.slice(0, 7);
  // console.log("Activities Data:", activities);
  // console.log("Activities Chart Data:", activitieschartData);
  return (
    <div className="min-h-dvh bg-[#EEEDED] text-[#201C1C] font-mono selection:bg-[#EA3A3A] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Background Graphic Grid Line Accents */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,58,58,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#DBDBDB_1px,transparent_1px),linear-gradient(to_bottom,#DBDBDB_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />

      {/* <Navbar /> */}

      <div className="flex flex-1 relative z-10 w-full">
        <main className="flex-1 min-w-0 w-full">
          <motion.div
            variants={staggerChassis}
            initial="initial"
            animate="animate"
            className="px-4 sm:px-6 py-10 flex flex-col gap-8 max-w-7xl mx-auto w-full"
          >

            {/* ── SECTION 1: HEADER GREETING ──────────────────────── */}
            <motion.div variants={microCardFade} className="border-b border-neutral-300/80 pb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-[#201C1C] uppercase font-sans leading-none">
                Welcome back, <span className="text-[#EA3A3A] font-serif italic lowercase tracking-normal">athlete.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" /> Profile synchronized · Core Online
              </p>
            </motion.div>

            {/* ── SECTION 2: TOP LEVEL MATRIX METRIC CARDS ────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Streak Card */}
              <motion.div
                variants={microCardFade}
                whileHover={{ y: -2 }}
                className="bg-[#201C1C] text-[#EEEDED] rounded-2xl p-6 border border-neutral-900 shadow-sm relative overflow-hidden group transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center border border-neutral-800 text-[#EA3A3A]">
                    <Flame size={15} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Streak Vector</span>
                </div>
                <p className="text-4xl font-black text-white tracking-tighter">
                  {streakData[0]?.CurrentStreak || 0} <span className="text-xs uppercase text-neutral-500 font-sans font-bold tracking-wide">Days</span>
                </p>
              </motion.div>

              {/* Rank Card */}
              <motion.div
                variants={microCardFade}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-6 border border-neutral-300 shadow-sm relative overflow-hidden group transition-all"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EA3A3A]" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EEEDED] flex items-center justify-center text-[#201C1C]">
                    <TrendingUp size={15} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Global Standing</span>
                </div>
                <p className="text-4xl font-black text-[#201C1C] tracking-tighter group-hover:text-[#EA3A3A] transition-colors">
                  #{profileData[0]?.GlobalRank || 0} <span className="text-xs uppercase text-neutral-400 font-sans font-bold tracking-wide">Overall</span>
                </p>
              </motion.div>

              {/* Allies Card */}
              <motion.div
                variants={microCardFade}
                whileHover={{ y: -2 }}
                className="bg-white rounded-2xl p-6 border border-neutral-300 shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EEEDED] flex items-center justify-center text-[#201C1C]">
                    <Users size={15} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Allies System</span>
                </div>
                <p className="text-4xl font-black text-[#201C1C] tracking-tighter">
                  {profileData[0]?.TotalActivities || 0} <span className="text-xs uppercase text-neutral-400 font-sans font-bold tracking-wide">Active</span>
                </p>
              </motion.div>
            </div>

            {/* ── SECTION 3: FIXED HIGH-FIDELITY LEADERBOARD ───────── */}
            <motion.div
              variants={microCardFade}
              className="w-full bg-white rounded-2xl border border-neutral-300 shadow-sm flex flex-col overflow-hidden"
            >
              <div className="p-5 bg-[#201C1C] text-[#EEEDED] border-b border-neutral-900 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <Trophy size={16} className="text-[#EA3A3A]" />
                  <span className="font-black text-xs uppercase tracking-widest text-white">
                    Global Tournament Brackets
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-black px-3 py-1 rounded border border-neutral-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA3A3A] animate-ping" />
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Live Grid</span>
                </div>
              </div>

              {/* Balanced Header Columns */}
              <div className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b border-neutral-200 bg-[#EEEDED]/30 gap-2 items-center">
                <span className="col-span-2 text-[9px] font-black text-neutral-400 uppercase tracking-widest">Pos</span>
                <span className="col-span-6 text-[9px] font-black text-neutral-400 uppercase tracking-widest">Athlete Competitor</span>
                <span className="col-span-4 text-[9px] font-black text-neutral-400 uppercase tracking-widest text-right">Score Breakdown</span>
              </div>

              {/* Rows Container */}
              <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto custom-preview-scrollbar bg-white w-full">
                {displayPlayers.map((player) => {
                  const isCurrentUser = (player as any).isYou;
                  return (
                    <div
                      key={player.rank}
                      className={`grid grid-cols-12 px-4 sm:px-6 py-4 gap-2 items-center border-l-4 transition-colors w-full ${isCurrentUser ? "bg-[#EA3A3A]/5 border-[#EA3A3A]" : "hover:bg-neutral-50/50 border-transparent"}`}
                    >
                      <span className={`col-span-2 text-xs sm:text-sm font-black ${player.rank === 1 ? "text-[#EA3A3A]" : "text-neutral-400"}`}>
                        {player.rank.toString().padStart(2, '0')}
                      </span>

                      <div className="col-span-6 min-w-0 pr-2">
                        <p className={`text-xs sm:text-sm font-black truncate tracking-tight ${isCurrentUser ? "text-[#EA3A3A]" : "text-[#201C1C]"}`}>
                          @{player.username}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 font-sans truncate">
                          {player.sport}
                        </p>
                      </div>

                      <div className="col-span-4 text-right flex flex-col justify-center min-w-0">
                        <span className="text-xs sm:text-sm font-black text-[#201C1C] truncate">
                          {player.xp.toLocaleString()} <span className="text-[9px] font-sans font-bold text-neutral-400">XP</span>
                        </span>
                        <span className="text-[9px] text-neutral-400 mt-0.5 uppercase tracking-tighter truncate font-sans">
                          {player.streak}d active streak
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clean Bottom Action Bar Grid */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 w-full">
                <button
                  onClick={() => router.push("/leaderboard")}
                  className="w-full py-3 bg-[#201C1C] hover:bg-[#EA3A3A] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99]"
                >
                  Enter Main Analytics Console
                </button>
              </div>
            </motion.div>

            {/* ── SECTION 4: HORIZONTAL INTENSITY ROW WITH MOBILE GRAPH LABELS ── */}
            <motion.div
              variants={microCardFade}
              className="w-full bg-white rounded-2xl border border-neutral-300 shadow-sm p-5 sm:p-6 flex flex-col justify-between h-[430px]"
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <BarChart2 size={16} className="text-[#EA3A3A]" />
                  <span className="font-black text-[#201C1C] text-xs uppercase tracking-widest">
                    Training Intensity Vector
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-wider bg-[#EEEDED] text-neutral-600 px-3 py-1 rounded font-bold border border-neutral-300/60">
                  Data Window: 14 Nodes
                </span>
              </div>

              <p className="text-xs text-neutral-400 font-medium italic font-serif">
                "Consistency yields raw computational output."
              </p>

              {/* Mobile-Optimized Display Bar Graph Grid Container */}
              <div className="flex-1 flex items-end gap-1.5 sm:gap-3 px-1 h-[190px] max-h-[190px] mt-10 mb-4 select-none">
                {activitieschartData.map((d, i) => {
                  const barHeightPercentage = Math.max(8, (d.uploads / maxUploads) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative">
                      <div className="w-full relative flex flex-col items-center h-full justify-end group">

                        {/* Static Text Counter (Perfect for Mobile Viewports) */}
                        <span className="text-[8px] sm:text-[10px] font-mono font-black text-[#201C1C] mb-1 group-hover:text-[#EA3A3A] transition-colors">
                          {d.uploads}
                        </span>

                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeightPercentage}%` }}
                          transition={{ type: "spring", stiffness: 150, damping: 20, delay: i * 0.01 }}
                          className="w-full rounded-t-sm bg-[#EEEDED] group-hover:bg-[#EA3A3A] transition-all duration-200 shadow-sm"
                        />
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 group-hover:text-[#201C1C] font-bold transition-all mt-0.5">
                        {d.day.charAt(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Data Summary Analytics Footer Badge Grid */}
              <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-neutral-200">
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-[#201C1C]">
                    {activitieschartData.length}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mt-0.5">Total Workouts</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-[#EA3A3A]">
                    {streakData[0]?.LongestStreak || 0}d
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mt-0.5">Personal Record</p>
                </div>
              </div>
            </motion.div>

            {/* ── SECTION 5: INTERACTIVE ASYMMETRIC TIMELINE ROADMAP ── */}
            <motion.div variants={microCardFade} className="bg-white rounded-2xl border border-neutral-300 p-6 md:p-8 shadow-sm">
              <div className="mb-8">
                <span className="text-[9px] uppercase tracking-widest font-black text-[#EA3A3A] block mb-1">Development Trajectory</span>
                <h2 className="text-xl font-black uppercase tracking-widest text-[#201C1C]">Progression Framework Map</h2>
              </div>

              <div className="relative flex flex-col gap-12 pl-4 sm:pl-6 md:pl-10">
                {/* Connecting Timeline Filament Line */}
                <div className="absolute left-[23px] sm:left-[33px] md:left-[41px] top-4 bottom-4 w-0.5 bg-neutral-200" />

                {/* Node Link 1 */}
                <motion.div variants={timelineNode} whileHover={{ x: 3 }} className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 z-10 group">
                  <div className="w-10 h-10 rounded-xl bg-[#201C1C] text-[#EEEDED] group-hover:bg-[#EA3A3A] group-hover:text-white flex items-center justify-center font-black text-sm border border-neutral-800 transition-colors shadow-md shrink-0">
                    01
                  </div>
                  <div className="flex-1 bg-neutral-50 group-hover:bg-neutral-50/40 p-5 rounded-2xl border border-neutral-200 group-hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-[#201C1C] flex items-center gap-2 group-hover:text-[#EA3A3A] transition-colors">
                        <Trophy size={14} /> Contests Field
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans font-medium">
                        Enter live tactical competitive bracket tournaments configured to match your division rating.
                      </p>
                    </div>
                    <Link href="/contests" className="px-5 py-2.5 bg-white hover:bg-[#201C1C] text-[#201C1C] hover:text-white border border-neutral-300 hover:border-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm shrink-0 text-center">
                      Deploy
                    </Link>
                  </div>
                </motion.div>

                {/* Node Link 2 */}
                <motion.div variants={timelineNode} whileHover={{ x: 3 }} className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 z-10 group">
                  <div className="w-10 h-10 rounded-xl bg-[#201C1C] text-[#EEEDED] group-hover:bg-[#EA3A3A] group-hover:text-white flex items-center justify-center font-black text-sm border border-neutral-800 transition-colors shadow-md shrink-0">
                    02
                  </div>
                  <div className="absolute left-[19px] sm:left-[25px] md:left-[31px] top-[-30px] w-4 h-8 border-l-2 border-b-2 border-dashed border-neutral-300 rounded-bl-lg hidden sm:block" />

                  <div className="flex-1 bg-neutral-50 group-hover:bg-neutral-50/40 p-5 rounded-2xl border border-neutral-200 group-hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-[#201C1C] flex items-center gap-2 group-hover:text-[#EA3A3A] transition-colors">
                        <Target size={14} /> Workout Assignments
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans font-medium">
                        Execute target objective parameters to score platform verification bonuses.
                      </p>
                    </div>
                    <Link href="/tasks" className="px-5 py-2.5 bg-white hover:bg-[#201C1C] text-[#201C1C] hover:text-white border border-neutral-300 hover:border-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm shrink-0 text-center">
                      Initialize
                    </Link>
                  </div>
                </motion.div>

                {/* Node Link 3 */}
                <motion.div variants={timelineNode} whileHover={{ x: 3 }} className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 z-10 group">
                  <div className="w-10 h-10 rounded-xl bg-[#201C1C] text-[#EEEDED] group-hover:bg-[#EA3A3A] group-hover:text-white flex items-center justify-center font-black text-sm border border-neutral-800 transition-colors shadow-md shrink-0">
                    03
                  </div>
                  <div className="flex-1 bg-neutral-50 group-hover:bg-neutral-50/40 p-5 rounded-2xl border border-neutral-200 group-hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-wider text-[#201C1C] flex items-center gap-2 group-hover:text-[#EA3A3A] transition-colors">
                        <ShoppingBag size={14} /> Apparel & Gear Supply
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans font-medium">
                        Equip authorized performance footwear lines, nutritional matrices, and system accessories.
                      </p>
                    </div>
                    <Link href="/store" className="px-5 py-2.5 bg-white hover:bg-[#201C1C] text-[#201C1C] hover:text-white border border-neutral-300 hover:border-neutral-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm shrink-0 text-center">
                      Inspect
                    </Link>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </motion.div>

          <Footer />
        </main>
      </div>

      {/* Embedded Webkit Bar Optimization Blocks */}
      <style>{`
        .custom-preview-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-preview-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-preview-scrollbar::-webkit-scrollbar-thumb {
          background: #EEEDED;
          border-radius: 999px;
        }
        .custom-preview-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EA3A3A;
        }
      `}</style>
    </div>
  );
}