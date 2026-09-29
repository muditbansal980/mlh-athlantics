"use client";

import { BACKEND_URL } from "@/config/app";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, Medal, Filter, ShieldAlert, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
    Rank: number;
    username: string;
    score: number;
}

// Map the SportCategory enum for clean select rendering
const SPORT_CATEGORIES = [
  { value: "PUSHUPS", label: "Pushups" },
  { value: "RUNNING", label: "Running" },
  { value: "SQUATS", label: "Squats" },
  { value: "BADMINTON", label: "Badminton" },
  { value: "BASKETBALL", label: "Basketball" },
  { value: "FOOTBALL", label: "Football" },
  { value: "CRICKET", label: "Cricket" },
  { value: "TUG_OF_WAR", label: "Tug of War" },
  { value: "WEIGHTLIFTING", label: "Weightlifting" },
  { value: "YOGA", label: "Yoga" },
  { value: "SWIMMING", label: "Swimming" },
];

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const currentCategory = searchParams.get("category") || "AllSports";

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/leaderboard/getLeaderboard?category=${currentCategory}`, {
                    credentials: "include",
                    method: "GET",
                });
                
                if (res.status === 401) {
                    alert("Please log in to access the leaderboard.");
                    return;
                }
                
                if (!res.ok) throw new Error("Failed to fetch leaderboard data");
                
                const data = await res.json();
                // console.log("Fetched leaderboard data:", data);
                const activeAthletes = data.filter((player: LeaderboardEntry) => player.score !== 0);
                setLeaderboardData(activeAthletes);
            } catch (err) {
                console.error("Error fetching leaderboard data:", (err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        
        fetchLeaderboard();
    }, [currentCategory]);

    const handleCategoryChange = (category: string) => {
        if (category === "AllSports") {
            router.push("/leaderboard");
        } else {
            router.push(`/leaderboard?category=${category}`);
        }
    };

    return (
        <div className="relative min-h-dvh w-full bg-white text-black flex flex-col items-center justify-start p-4 sm:p-8 md:p-12 overflow-hidden font-sans">
            
            {/* --- FANCY SUBTLE GRID BACKGROUND --- */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

            {/* --- CONTAINER --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md border border-neutral-200 shadow-2xl rounded-2xl p-6 sm:p-10 flex flex-col gap-8"
            >
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-neutral-200 pb-6 gap-4">
                    <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-widest bg-crimson-red text-white bg-red-700 px-3 py-1 rounded">
                            LIVE // RANKINGS
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-serif italic text-black mt-2">
                            Sports <span className="text-red-700 not-italic font-sans">Leaderboard.</span>
                        </h1>
                    </div>

                    {/* --- FILTER BAR --- */}
                    <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 p-2 rounded-xl self-start md:self-auto shadow-sm">
                        <label htmlFor="sport-filter" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 pl-2">
                            <Filter className="w-3.5 h-3.5 text-red-700" />
                            Sport:
                        </label>
                        <select 
                            id="sport-filter"
                            value={currentCategory} 
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="bg-white border border-neutral-200 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-700 transition-colors cursor-pointer text-black"
                        >
                            <option value="AllSports">🏆 All Sports</option>
                            {SPORT_CATEGORIES.map((sport) => (
                                <option key={sport.value} value={sport.value}>
                                    {sport.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* --- TABLE & DATA STATES --- */}
                <div className="relative overflow-hidden w-full rounded-xl border border-neutral-200 bg-white shadow-inner min-h-[300px] flex flex-col justify-start">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80"
                            >
                                <Loader2 className="w-8 h-8 animate-spin text-red-700" />
                                <p className="text-sm font-mono tracking-wider text-neutral-400 uppercase animate-pulse">Syncing metrics...</p>
                            </motion.div>
                        ) : leaderboardData.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-2"
                            >
                                <ShieldAlert className="w-10 h-10 text-neutral-300" />
                                <h3 className="text-lg font-bold text-neutral-800">No Data Tracked</h3>
                                <p className="text-xs sm:text-sm text-neutral-400 max-w-xs">Nobody has submitted scores for this sport category yet.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full overflow-x-auto"
                            >
                                <table className="w-full border-collapse text-left text-sm sm:text-base">
                                    <thead>
                                        <tr className="bg-neutral-950 text-white font-mono uppercase tracking-wider text-xs border-b border-neutral-900">
                                            <th className="py-4 px-6 font-bold text-center w-20">Rank</th>
                                            <th className="py-4 px-6 font-bold">Contender</th>
                                            <th className="py-4 px-6 font-bold text-right pr-8">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {leaderboardData.map((player, index) => {
                                            const computedRank = player.Rank || index + 1;
                                            
                                            // Top-tier podium stylings based on ranking numbers
                                            const isTop3 = computedRank <= 3;
                                            const rowBg = computedRank === 1 ? "bg-red-50/40 hover:bg-red-50/70" : "hover:bg-neutral-50/80";

                                            return (
                                                <tr key={index} className={`transition-colors ${rowBg}`}>
                                                    <td className="py-4 px-6 font-mono font-bold text-center flex items-center justify-center">
                                                        {computedRank === 1 && <Trophy className="w-5 h-5 text-red-700 animate-bounce" />}
                                                        {computedRank === 2 && <Medal className="w-5 h-5 text-neutral-500" />}
                                                        {computedRank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                                                        {!isTop3 && <span className="text-neutral-400">#</span>}
                                                        {!isTop3 && computedRank}
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-black tracking-tight">
                                                        <div className="flex flex-col">
                                                            <span className={`text-base ${computedRank === 1 ? "font-bold text-red-900" : "font-semibold"}`}>
                                                                {player.username}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right font-mono font-black text-base pr-8 text-neutral-950">
                                                        {player.score.toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- FOOTER ATOMIC DATA LABELS --- */}
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-neutral-400 font-mono border-t border-neutral-200 pt-4">
                    <span>SELECTION: {currentCategory.toUpperCase()}</span>
                    <span>AUTOMATIC REFRESH ACTIVE</span>
                </div>
            </motion.div>
        </div>
    );
}