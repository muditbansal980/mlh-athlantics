"use client";

import { getcontestsbyparticularorg } from "../../../../api/organization/getcontestsbyparticularorg";
import { useState, useEffect } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Activity, ShieldAlert, Cpu, Terminal, Calendar, Award } from "lucide-react";
import Navbar from "@/layouts/Navbar";

export default function ManageContests() {
    const [contests, setContests] = useState([]);
    const [error, setError] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    useEffect(() => {
        getcontestsbyparticularorg()
            .then((data) => {
                if (data.error) {
                    if(data.status === 404){
                        // setError("No contests found for your organization.");
                        setContests([]); // Clear contests to show empty state
                    }
                    setError(data.error);
                    setErrdisplay("fixed");
                } else {
                    setContests(data);
                }
            })
            .catch((err) => {
                console.error("Error fetching contests for the organization:", err);
                setError(`Failed to fetch contests for the organization: ${err.message}`);
                setErrdisplay("fixed");
            });
    }, []);
    if (errdisplay==="fixed") {
        setTimeout(() => {
            setErrdisplay("hidden");
        }, 5000);
    }

    return (
        <div className="relative min-h-dvh w-full bg-[#0a0a0c] text-neutral-200 overflow-x-hidden font-mono selection:bg-red-700 selection:text-white flex flex-col">
            
            {/* Navbar streams fluidly across the layout header pipeline */}
            {/* <Navbar /> */}

            {/* --- SCI-FI CINEMATIC BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />
            
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neutral-800/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

            {/* --- EXPANDED MAIN WORKSPACE PIPELINE (Claiming all remaining space) --- */}
            <div className="flex-1 w-full p-4 sm:p-6 md:p-8 z-10 flex flex-col">
                
                {/* --- FULL WIDTH CORE CONTROL PANEL CONTAINER --- */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.99, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative w-full flex-1 bg-[#0c0c0e]/70 backdrop-blur-xl border border-neutral-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
                >
                    {/* Tactical Ambient Tech Lines */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-red-700/50 to-transparent" />
                    <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />

                    {/* --- HEADER SECTION (HOLOGRAPHIC ORBIT) --- */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-900 pb-6 gap-4">
                        <div className="relative">
                            <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-red-500 uppercase font-black mb-1">
                                <Activity className="w-3.5 h-3.5 animate-pulse text-red-600" />
                                Core Mainframe // Operational
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white font-serif italic">
                                Manage <span className="text-red-600 not-italic font-sans">Contests.</span>
                            </h1>
                        </div>

                        {/* Experimental Status Readout */}
                        <div className="flex items-center gap-4 bg-black/40 border border-neutral-800 px-4 py-2 rounded-xl text-xs text-neutral-400 shadow-inner self-start sm:self-auto">
                            <Cpu className="w-5 h-5 text-neutral-500 animate-spin [animation-duration:8s]" />
                        </div>
                    </div>

                    {/* --- LEGACY COMPONENT COMPATIBILITY --- */}
                    <ErrorPopup message={error} display={errdisplay} />

                    {/* --- CONTEST STREAM DISPLAY CONTAINER --- */}
                    <div className="flex-1 flex flex-col justify-start w-full">
                        <AnimatePresence mode="wait">
                            {contests.length === 0 ? (
                                <motion.div 
                                    key="empty-state"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-neutral-800 rounded-xl bg-black/20 min-h-[350px]"
                                >
                                    <div className="relative mb-4">
                                        <Orbit className="w-12 h-12 text-neutral-700 animate-spin [animation-duration:12s]" />
                                        <Terminal className="w-5 h-5 text-red-600 absolute inset-0 m-auto animate-pulse" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">No Vector Channels Configured</h3>
                                    <p className="text-xs text-neutral-500 max-w-xs mt-1">No active contests were captured running for this system terminal instance.</p>
                                </motion.div>
                            ) : (
                                <motion.ul 
                                    key="contest-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 w-full"
                                >
                                    {contests.map((contest: any, idx: number) => (
                                        <motion.li 
                                            key={contest.Id || idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            whileHover={{ scale: 1.005, borderColor: "rgba(185, 28, 28, 0.4)" }}
                                            className="group relative p-5 bg-[#0e0e11]/80 backdrop-blur-md border border-neutral-800 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:shadow-[0_0_25px_rgba(185,28,28,0.15)] w-full"
                                        >
                                            {/* Dynamic Left Active Hologram Accent bar */}
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-neutral-800 group-hover:bg-red-600 transition-colors" />

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded uppercase tracking-wider">
                                                        ID: #{String(contest.Id || contest.id || idx).slice(0, 5)}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg font-bold text-white tracking-tight group-hover:text-red-500 transition-colors">
                                                    {contest.Title || contest.title}
                                                </h2>
                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed max-w-4xl font-sans">
                                                    {contest.Description || contest.description}
                                                </p>
                                            </div>

                                            {/* Right Metadata Tag Grid */}
                                            <div className="flex items-center gap-3 self-start sm:self-auto min-w-[140px] sm:justify-end">
                                                <div className="flex flex-col sm:text-right">
                                                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1 sm:justify-end">
                                                        <Award className="w-3 h-3 text-red-500" /> Category
                                                    </span>
                                                    <span className="text-xs font-black uppercase text-neutral-200 mt-0.5">
                                                        {contest.Category || contest.category || "Standard"}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}