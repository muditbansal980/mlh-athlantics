"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/layouts/Navbar";
import { fetchContestsOrganizedByRespective } from "../../../../../../api/contests/fetchcontestsorganizedbyrespective";
import { motion, AnimatePresence } from "framer-motion";
import { Variants } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Award, 
  Layers, 
  ChevronRight, 
  PlusCircle,
  AlertCircle,
  Users
} from "lucide-react";

export default function getContestsOrganizedByRespective() {
    const [contests, setContests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchContestsOrganizedByRespective();
                setContests(data);
            } catch (err) {
                console.error("Error fetching contests organized by respective:", (err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Fixed Date Formatter ───────────────────────────────────────────────
    const formatDateTime = (isoString: string) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "Invalid Date";

        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    // Framer Motion Layout Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: { type: "spring", stiffness: 260, damping: 25 }
        },
        hover: {
            y: -4,
            borderColor: "rgba(220, 38, 38, 0.4)",
            boxShadow: "0 12px 30px -10px rgba(0, 0, 0, 0.3)",
            transition: { duration: 0.2, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0C] text-gray-100 font-sans selection:bg-red-600 selection:text-white">
            {/* <Navbar /> */}
            
            <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Dashboard Sub-Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-6 mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl flex items-center gap-2">
                            <Layers className="text-red-600 w-7 h-7" />
                            Organized <span className="text-red-600">Contests</span>
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Monitor, evaluate, and track performance modules across your hosted arenas.
                        </p>
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-900/20 transition-all duration-200 group self-start sm:self-center">
                        <PlusCircle size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                        Create Workspace
                    </button>
                </div>

                {/* Main Data Layer Handling */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        /* Premium Skeleton Loading States */
                        <motion.div 
                            key="skeleton-loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-5 space-y-4 animate-pulse">
                                    <div className="h-6 bg-zinc-800 rounded-md w-3/4" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-zinc-800 rounded-md w-full" />
                                        <div className="h-4 bg-zinc-800 rounded-md w-5/6" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <div className="h-4 bg-zinc-800 rounded-md w-1/3" />
                                        <div className="h-4 bg-zinc-800 rounded-md w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : contests.length === 0 ? (
                        /* Empty State Container */
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#121214] border border-zinc-800/40 rounded-3xl"
                        >
                            <div className="w-14 h-14 bg-zinc-900/80 border border-zinc-800 flex items-center justify-center rounded-2xl mb-4 shadow-inner">
                                <AlertCircle className="text-zinc-500 w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white">No active structures detected</h3>
                            <p className="text-sm text-zinc-400 max-w-sm mt-1">
                                No contests organized by respective found. Initialize a module sequence to begin dashboard logging.
                            </p>
                        </motion.div>
                    ) : (
                        /* Populated Interactive Content Grid */
                        <motion.div 
                            key="content-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >
                            {contests.map((contest) => (
                                <motion.div
                                    key={contest.Id}
                                    variants={cardVariants}
                                    whileHover="hover"
                                    className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/10 transition-colors duration-300" />
                                    
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h2 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors duration-200 tracking-tight line-clamp-1">
                                                {contest.Name || contest.Title}
                                            </h2>
                                            <span 
                                                onClick={() => router.push(`/your-contests/${contest.Id}`)}
                                                className="flex-shrink-0 p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 cursor-pointer"
                                                title="View Workspace Dashboard"
                                            >
                                                <Award size={14} />
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-5">
                                            {contest.Description || "No further details documented for this workspace profile context layout."}
                                        </p>
                                    </div>

                                    {/* Timeline Metadata Section */}
                                    <div className="border-t border-zinc-800/60 pt-4 mt-auto space-y-2.5">
                                        <div className="flex items-center text-xs text-zinc-400 gap-2">
                                            <Calendar size={13} className="text-red-600 flex-shrink-0" />
                                            <span className="font-medium text-zinc-500">Reg Opens:</span>
                                            <span className="text-zinc-300 font-semibold truncate">
                                                {formatDateTime(contest.RegistrationStartDate || contest.StartDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-zinc-400 gap-2 pb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <Clock size={13} className="text-zinc-500 flex-shrink-0" />
                                                <span className="font-medium text-zinc-500">Reg Closes:</span>
                                                <span className="text-zinc-300 font-semibold truncate">
                                                    {formatDateTime(contest.RegistrationEndDate || contest.EndDate)}
                                                </span>
                                            </div>
                                            
                                            <span 
                                                onClick={() => router.push(`/your-contests/${contest.Id}`)} 
                                                className="text-zinc-500 hover:text-red-500 hover:translate-x-1 transition-all duration-200 pl-2 cursor-pointer"
                                            >
                                                <ChevronRight size={14} />
                                            </span>
                                        </div>

                                        {/* ── ACTION INTERFACE: VIEW REGISTRATIONS TRIGGER BUTTON ────────────────── */}
                                        <div className="pt-2 border-t border-zinc-800/40">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents layout target bubble interference
                                                    router.push(`/contests/${contest.Id}/registrations`);
                                                }}
                                                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold rounded-lg border border-zinc-800 transition-colors"
                                            >
                                                <Users size={12} className="text-red-600" />
                                                View Registrations
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}