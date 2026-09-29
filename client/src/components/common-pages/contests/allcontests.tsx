"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config/app";
import Navbar from "../../../layouts/Navbar";
import { fetchallContests } from "../../../../api/contests/getallcontests";
interface Contest {
    Id: string;
    Title: string;
    Mode: "Online" | "Offline" | "Hybrid";
    SportCategory: string;
    Location: string;
    Fee: number;
    ParticipationType: string;
    RegistrationEndDate: string;
    EventStartDate: string;
}

const MODE_COLORS: Record<string, string> = {
    Online: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    Offline: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Hybrid: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const MODE_ICONS: Record<string, string> = {
    Online: "💻",
    Offline: "🏟️",
    Hybrid: "🌐",
};

function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="h-4 w-16 rounded-full bg-white/10" />
                <div className="h-4 w-20 rounded-full bg-white/10" />
            </div>
            <div className="h-6 w-3/4 rounded-lg bg-white/10" />
            <div className="h-4 w-1/2 rounded-lg bg-white/10" />
            <div className="flex gap-2 mt-1">
                <div className="h-6 w-20 rounded-full bg-white/10" />
                <div className="h-6 w-24 rounded-full bg-white/10" />
            </div>
            <div className="flex justify-between items-center mt-2">
                <div className="h-5 w-16 rounded-lg bg-white/10" />
                <div className="h-8 w-8 rounded-xl bg-white/10" />
            </div>
        </div>
    );
}

function ContestCard({ contest }: { contest: Contest }) {
    const [contestId, setContestId] = useState<string | null>(null);
    const router = useRouter();
    const modeStyle = MODE_COLORS[contest.Mode] ?? "text-white/50 bg-white/5 border-white/10";
    const modeIcon = MODE_ICONS[contest.Mode] ?? "📍";

    const formatDate = (d: string) => {
        try {
            return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return d;
        }
    };

    return (
        <div className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3 hover:border-lime-400/30 hover:bg-lime-400/[0.03] transition-all duration-200">
            {/* Top row */}
            <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-lime-400/70 bg-lime-400/10 border border-lime-400/20 px-2.5 py-1 rounded-full">
                    {contest.SportCategory}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${modeStyle}`}>
                    <span>{modeIcon}</span> {contest.Mode}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-extrabold text-base text-white leading-snug tracking-tight group-hover:text-lime-400 transition-colors line-clamp-2">
                {contest.Title}
            </h3>

            {/* Location */}
            {contest.Location && (
                <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {contest.Location}
                </p>
            )}

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
                <span className="text-xs text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    {contest.ParticipationType === "Team" ? "👥" : "🏃"} {contest.ParticipationType}
                </span>
                <span className="text-xs text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    📅 {formatDate(contest.EventStartDate)}
                </span>
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center mt-1 pt-3 border-t border-white/5">
                <div>
                    {contest.Fee === 0 ? (
                        <span className="text-lime-400 font-black text-sm">FREE</span>
                    ) : (
                        <span className="text-white font-black text-sm">₹{contest.Fee.toLocaleString("en-IN")}</span>
                    )}
                    <p className="text-white/25 text-xs">Reg. ends {formatDate(contest.RegistrationEndDate)}</p>
                </div>
                <button
                    onClick={() => {
                        router.push(`/contests/${contest.Id}`);
                        setContestId(contest.Id);
                    }}
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-all duration-200 group-hover:border-lime-400/30"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function ContestsPage() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(() => {
        fetchallContests()
            .then((data: any) => {
                if ('error' in data) {
                    setError(data.error);
                    console.error("Error fetching contests:", data.error);
                } else {
                    setContests(data);
                    // console.log("Contests fetched successfully:", data);
                }
            })
            .finally(() => setLoading(false));
    }, []);
    return (

        <div className="min-h-dvh bg-[#080c08] text-white" style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
           {/* <Navbar /> */}

            {/* Header */}
            <div className="border-b border-white/10 bg-[#080c08]/90 backdrop-blur-lg sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        {/* <span className="text-lime-400 text-xs font-bold tracking-widest uppercase">Athlantic</span> */}
                        <h1 className="text-xl font-extrabold tracking-tight leading-none mt-0.5">Contests</h1>
                    </div>
                    {!loading && !error && (
                        <span className="text-white/30 text-xs font-semibold border border-white/10 px-3 py-1.5 rounded-full">
                            {contests.length} {contests.length === 1 ? "contest" : "contests"}
                        </span>
                    )}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm mb-6">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Skeleton */}
                {loading && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && contests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="text-5xl mb-4">🏆</div>
                        <h2 className="text-xl font-extrabold text-white mb-2">No Contests Yet</h2>
                        <p className="text-white/30 text-sm max-w-xs">
                            Contests will appear here once they're added to the platform.
                        </p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && contests.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contests.map(c => { return <ContestCard key={c.Id} contest={c} />; })}
                    </div>
                )}
            </main>

        </div>
        
    );
}
