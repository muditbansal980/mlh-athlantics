"use client";

import { fetchalltasks } from "../../../../api/tasks/getalltasks";
// import { createUserInDB } from "../../../../api/tasks/creatinguserindb";
import { useEffect, useState } from "react";
// import Navbar from "../../../layouts/Navbar";
import { useRouter } from "next/navigation";
import { fetchUserData } from "../../../../api/user/getuserdata";
import { useUserData } from "../../../../store/usesUserData";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, ClipboardList, Sparkles } from "lucide-react";
import { Variants } from "framer-motion";
// Framer Motion Variants for Premium Feel Orchestration
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 260, damping: 25 } 
  }
};

export default function GetAllTasks() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const { currentUser } = useUserData();
  const [userId, setUserId] = useState<string>(" ");

  useEffect(() => {
    if (currentUser) {
      setUserId(currentUser.Id);
    } else {
      // console.log("No user data in Zustand, fetching from backend...");
      fetchUserData()
        .then((res) => {
          // console.log("Fetched user data:", res);
          if (res && !res.error) {
            setUserId(res.Id);
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", (err as Error).message);
        });
    }
  }, [userId,currentUser]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchalltasks();
      setData(data);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-dvh bg-[#EEEDED] text-[#201C1C] font-sans selection:bg-[#EA3A3A] selection:text-white pb-12">
      {/* <Navbar /> */}
      
      {/* Background Decorative Tech Grid Grid Mesh */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#D1D1D6_1px,transparent_1px),linear-gradient(to_bottom,#D1D1D6_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30 pointer-events-none" />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* =========================================================
            1. STATS OVERVIEW CHASSIS (Midnight Core Black)
           ========================================================= */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#201C1C] text-[#EEEDED] rounded-3xl p-6 md:p-8 mb-10 overflow-hidden border border-neutral-900 shadow-[0_20px_50px_rgba(32,28,28,0.15)]"
        >
          {/* Subtle Graphic Crimson Orb Backlighting */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#EA3A3A] rounded-full opacity-20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#EA3A3A] text-[10px] font-mono uppercase tracking-widest font-bold mb-1">
                <Sparkles className="w-3 h-3" /> Operational Engine Vector
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-serif italic tracking-tight text-white mb-2">
                Task <span className="text-[#EA3A3A]">Overview</span>
              </h2>
              <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
                Total metrics and targets currently broadcasted live across the system nodes.
              </p>
            </div>

            <div className="flex-shrink-0">
              {/* Badge Counter Block */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-neutral-800">
                <span className="text-4xl font-black text-white font-mono tracking-tighter">
                  {data?.Tasks?.length || 0}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-wider text-[#EA3A3A] uppercase font-mono">Active</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Deployments</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            2. INTERACTIVE CONTENT LIST MATRIX
           ========================================================= */}
        {data?.Tasks?.length === 0 ? (
          
          /* --- HIGH END EMPTY STATE --- */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EEEDED] shadow-[0_12px_40px_rgba(32,28,28,0.04)] p-16 text-center max-w-xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EEEDED] text-[#201C1C] flex items-center justify-center mb-5 border border-neutral-200">
              <ClipboardList className="w-7 h-7 opacity-70" />
            </div>
            <h3 className="text-xl font-extrabold text-[#201C1C] tracking-tight">No Modules Broadcasted</h3>
            <p className="text-sm text-neutral-400 max-w-xs mx-auto mt-2 font-medium">
              There are currently no training targets configured inside this quadrant zone. Check back shortly.
            </p>
          </motion.div>

        ) : (

          /* --- DYNAMIC PACKET GRID HOVER SCENE --- */
          <>
            {/* Context Section Label */}
            <div className="mb-6 px-1 flex justify-between items-end">
              <div>
                <h2 className="text-xl font-black text-[#201C1C] tracking-tight uppercase font-mono">
                  Available Targets
                </h2>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                  Execute programs to harvest allocated point arrays
                </p>
              </div>
            </div>

            {/* List Array Map Wrapper */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3.5"
            >
              {data?.Tasks?.map((task: any,) => (
                <motion.div
                  key={task.Id}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.005 }}
                  className="group relative bg-white rounded-2xl border border-[#EEEDED] hover:border-neutral-300 shadow-[0_8px_30px_rgba(32,28,28,0.02)] hover:shadow-[0_16px_40px_rgba(32,28,28,0.06)] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all duration-300"
                >
                  {/* Visual Identity Left-hand Highlight Strip */}
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-transparent group-hover:bg-[#EA3A3A] rounded-l-2xl transition-colors duration-300" />

                  {/* Left Metadata Context */}
                  <div className="flex-1 min-w-0 pl-1">
                    <h3 className="font-extrabold text-[#201C1C] group-hover:text-[#EA3A3A] text-lg lg:text-xl tracking-tight transition-colors duration-200">
                      {task.Title}
                    </h3>
                    <p className="text-xs lg:text-sm text-neutral-500 font-normal leading-relaxed mt-1.5 line-clamp-2 max-w-3xl">
                      {task.Description}
                    </p>
                  </div>

                  {/* Right Metric Manipulation Triggers */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                    
                    {/* Points Allocation Micro Shield Badge */}
                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEEDED] border border-[#EEEDED] group-hover:bg-[#EA3A3A]/10 group-hover:border-[#EA3A3A]/20 transition-all duration-300">
                      <Trophy className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#EA3A3A] transition-colors" />
                      <span className="text-xs font-black text-[#201C1C] font-mono tracking-tight group-hover:text-[#EA3A3A] transition-colors">
                        +{task.XPReward} XP
                      </span>
                    </div>

                    {/* Action Execution Button */}
                    <button 
                      onClick={() => { router.push(`/tasks/${task.Id}`) }} 
                      className="px-4.5 py-2 rounded-xl bg-[#201C1C] hover:bg-[#EA3A3A] text-white text-xs font-bold tracking-wider uppercase font-mono shadow-sm hover:shadow-[0_4px_12px_rgba(234,58,58,0.25)] flex items-center gap-1.5 transition-all duration-200"
                    >
                      Start <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}