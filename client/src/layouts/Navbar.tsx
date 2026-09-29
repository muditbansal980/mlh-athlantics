"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Sparkles } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { NAV_LINKS, NOTIFICATIONS } from "../components/common-pages/home/dashboardData";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/app";
import { useRouter } from "next/navigation";
import { fetchUserData } from "../../api/user/getuserdata";
import { useUserData } from "../../store/usesUserData";
import ErrorPopup from "@/components/lib/errorpopup";
import { Logout } from "../../api/logout/logout"
import Logo from "../../assets/logo.png"
import { Notifications } from "@/types/notifications";
import { fetchNotifications } from "../../api/notifications/fetchnotifications";

type UserData = {
  Id: string;
  Username: string;
  Role: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, hydrated } = useUserData();
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);
  const [notificationslength, setNotificationslength] = useState<number>(0);
  const unreadCount = notificationslength
  const [error, setError] = useState<string | null>(null);
  const [errordisplay, setErrorDisplay] = useState("hidden");
  const [userData, setUserData] = useState<UserData | null>(null); // State to hold user data
  // Track hovered link for dynamic background pill animation
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  async function handlelogout() {
    try {
      const result = await Logout();
      if (result?.success) {
        router.push("/");
      } else {
        setError(result?.error || "Failed to log out. Please try again.");
        setErrorDisplay("fixed");
      }
    } catch (error) {
      setError("Failed to log out. Please try again.");
      setErrorDisplay("fixed");
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const notificationsData: Notifications[] = await fetchNotifications();
        setNotificationslength(notificationsData.length);
        // console.log("Fetched notifications data:", notificationsData);
      } catch (error) {
        console.error("Error fetching notifications data:", error);
      }
    }
    fetchData();
  }, [notificationslength]);
  useEffect(() => {
    if (!hydrated) return;
    if (currentUser) {
      setUserData(currentUser);
      return;
    }
    else {
      fetchUserData()
        .then((data) => {
          if (!data) {
            router.push("/");
          }
          if (data.error) {
            setError(data.error);
            router.push("/");
          }
          setUserData(data);
        });
    }
  }, [hydrated, currentUser])

  return (
    <header className="sticky top-0 z-40 bg-[#201C1C] border-b border-neutral-900 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-md bg-opacity-95">
      <ErrorPopup display={errordisplay} message={error || "An error occurred."} />
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* --- LEFT HAND: BRAND NODES & NAVIGATION CONTROLS --- */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Trigger — Mobile/Tablet viewports */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-[#EA3A3A] hover:bg-neutral-900 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </motion.button>

          {/* Logo Assembly Grid Layout */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-[0_0_15px_rgba(234,58,58,0.3)]">
              <img src={Logo.src} alt="Athlantic Logo" className="w-15 h-10" />
            </div>
            <span className="font-black text-white text-base tracking-tighter uppercase hidden sm:block">
              ATHLAN<span className="text-[#EA3A3A]">TIC</span>
            </span>
          </div>
        </div>

        {/* --- CENTER CHASSIS: INTERACTIVE TEXT HARVEST LINKS --- */}
        <nav
          className="hidden lg:flex items-center gap-1.5 bg-neutral-950/60 p-1.5 rounded-xl border border-neutral-900/80 relative"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.label}
                href={link.path}
                onMouseEnter={() => setHoveredLink(link.label)}
                className={[
                  "relative px-4 py-1.5 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors duration-200 z-10",
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                ].join(" ")}
              >
                {/* Active Dynamic Highlight Underline Layer */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#EA3A3A] rounded-lg -z-10 shadow-[0_2px_10px_rgba(234,58,58,0.3)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Background Tracking Pill */}
                <AnimatePresence>
                  {hoveredLink === link.label && !isActive && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-neutral-900 rounded-lg -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </AnimatePresence>

                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* --- RIGHT HAND: SYSTEM DEPLOYMENT HARDWARE SECTIONS --- */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Action Node: Notification Bell Component */}
          <div className="relative" onClick={() => router.push("/notifications")}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-200"
            >
              <Bell size={18} />
            </motion.button>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-md bg-[#EA3A3A] text-white text-[9px] font-mono font-black flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(234,58,58,0.5)]">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Action Node: Profile Quick Route Anchor */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/profile/${userData?.Username}`}
              className="w-9 h-9 rounded-xl bg-[#EEEDED] hover:bg-[#EA3A3A] text-[#201C1C] hover:text-white flex items-center justify-center font-black text-lg font-mono transition-all duration-200 shadow-inner group"
            >
              <span className="group-hover:scale-110 transition-transform">
                {userData?.Username ? userData.Username.charAt(0).toUpperCase() : "U"}

              </span>
            </Link>
          </motion.div>

          {/* Separation Border Grid Vector */}
          <div className="h-6 w-[1px] bg-neutral-800/80 mx-1" />

          {/* Action Node: Session Termination Trigger */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handlelogout}
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/20 text-neutral-500 hover:text-[#EA3A3A] hover:bg-[#EA3A3A]/10 border-dashed hover:border-solid hover:border-[#EA3A3A]/30 transition-all duration-200"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}