"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Settings, Bot, Sparkles, LayoutDashboard, User } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useStreak } from "@/hooks/streak";
import { SIDEBAR_NAV, ICON_MAP } from "@/constants/layouts";
import { ADMIN_SIDEBAR_NAV, ORG_SIDEBAR_NAV } from "@/constants/layouts";
import { fetchUserData } from "../../api/user/getuserdata";
import { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const sidebarOpen = useSidebarStore((s) => s.sidebarOpen);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);
  const { data: streakData } = useStreak();
  // Helper to safely determine if any nested link matches current route path
  const isSettingsActive = pathname === "/settings";

  // fetching user dataa for the naviagtion of the profile
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserData();
        // console.log("Fetched user data for sidebar:", data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [role]);
  // console.log("Sidebar role:", role);
  return (
    <>
      {/* Overlay — mobile only (Midnight Core Black with opacity) */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-[#201C1C] bg-opacity-40 z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel Chassis */}
      <aside
        className={[
          "fixed top-0 left-0 h-dvh bg-[#201C1C] text-[#EEEDED] border-r border-neutral-900 z-40",
          "flex transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ width: "var(--sidebar-width)" }}
      >
        
        {/* =========================================================
            1. FAR-LEFT CORE STRIP PANEL
           ========================================================= */}
        <div className="w-16 h-full bg-[#181515] border-r border-neutral-900/60 flex flex-col justify-between items-center py-4 flex-shrink-0">
          
          {/* Top Global Hub Anchor */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-white text-sm tracking-tighter shadow-lg shadow-[#EA3A3A]/10">
              <img src={Logo.src} alt="Athlantic Logo" className="w-15 h-10" />
            </div>
            
            {/* Quick Indicator Dot or Action Icon */}
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 border border-neutral-800">
              <LayoutDashboard size={16} />
            </div>
          </div>

          {/* Bottom Control Anchors */}
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Minimalist Profile Anchor Node */}
            <Link href={`/profile/${userData?.Username}`} onClick={closeSidebar} aria-label="Profile">
              <div className="w-9 h-9 rounded-full bg-[#EEEDED] hover:bg-[#EA3A3A] text-[#201C1C] hover:text-white flex items-center justify-center font-bold text-lg transition-colors shadow-inner">
                {userData?.Username ? userData.Username.charAt(0).toUpperCase() : "U"}
              </div>
            </Link>

            {/* System Isolated Settings Hub Anchor */}
            <Link
              href="/settings"
              onClick={closeSidebar}
              className={[
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group",
                isSettingsActive 
                  ? "bg-[#EA3A3A] text-white" 
                  : "text-neutral-500 hover:bg-neutral-900 hover:text-white"
              ].join(" ")}
              aria-label="Settings"
            >
              <Settings size={18} className={isSettingsActive ? "" : "group-hover:text-[#EA3A3A] transition-colors"} />
            </Link>
          </div>
        </div>

        {/* =========================================================
            2. DYNAMIC SHELF NAVIGATION PANEL
           ========================================================= */}
        <div className="flex-1 h-full flex flex-col justify-between min-w-0 bg-[#201C1C]">
          
          {/* Header Chassis Section */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-900/60 flex-shrink-0">
            <div className="flex flex-col">
              <span className="font-black text-white text-sm tracking-widest uppercase font-mono">
                ATHLAN<span className="text-[#EA3A3A]">TIC</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                {role || "PLAYER"} CONSOLE
              </span>
            </div>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-md text-neutral-500 hover:bg-neutral-900 hover:text-[#EA3A3A] transition-colors"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Contextual Route Links Container Engine */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-sidebar-scrollbar">
            {role === "ADMIN" &&
              ADMIN_SIDEBAR_NAV.slice(0, ADMIN_SIDEBAR_NAV.length).map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeSidebar}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 group",
                      isActive
                        ? "bg-[#EA3A3A]/15 text-[#EA3A3A] border border-[#EA3A3A]/30"
                        : "text-neutral-400 hover:bg-neutral-900/60 hover:text-white",
                    ].join(" ")}
                  >
                    <span className={isActive ? "text-[#EA3A3A]" : "text-neutral-500 group-hover:text-[#EA3A3A] transition-colors"}>
                      {ICON_MAP[item.label]}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

            {(role === "PLAYER" ||  role ==="COACH" ) &&
              SIDEBAR_NAV.slice(0, SIDEBAR_NAV.length).map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeSidebar}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 group",
                      isActive
                        ? "bg-[#EA3A3A]/15 text-[#EA3A3A] border border-[#EA3A3A]/30"
                        : "text-neutral-400 hover:bg-neutral-900/60 hover:text-white",
                    ].join(" ")}
                  >
                    <span className={isActive ? "text-[#EA3A3A]" : "text-neutral-500 group-hover:text-[#EA3A3A] transition-colors"}>
                      {ICON_MAP[item.label]}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

            {role === "ORGANIZATION" &&
              ORG_SIDEBAR_NAV.slice(0, ORG_SIDEBAR_NAV.length).map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeSidebar}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 group",
                      isActive
                        ? "bg-[#EA3A3A]/15 text-[#EA3A3A] border border-[#EA3A3A]/30"
                        : "text-neutral-400 hover:bg-neutral-900/60 hover:text-white",
                    ].join(" ")}
                  >
                    <span className={isActive ? "text-[#EA3A3A]" : "text-neutral-500 group-hover:text-[#EA3A3A] transition-colors"}>
                      {ICON_MAP[item.label]}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* Footer Workspace Panel Segment */}
          <div className="p-3 border-t border-neutral-900/60 flex-shrink-0 bg-neutral-900/10">
            <div className="w-full flex items-center justify-between px-2.5 py-2 bg-neutral-900/60 rounded-xl border border-neutral-900">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EA3A3A] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">Streak Vector</span>
              </div>
              <span className="text-[10px] font-mono font-black text-white bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                {streakData?.Streak?.CurrentStreak || 0}D
              </span>
            </div>
          </div>

        </div>
      </aside>

      {/* Embedded High-End Scrollbar Styling Elements */}
      <style>{`
        .custom-sidebar-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #181515;
          border-radius: 9999px;
        }
        .custom-sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EA3A3A;
        }
      `}</style>
    </>
  );
}