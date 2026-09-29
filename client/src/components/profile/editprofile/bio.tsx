"use client"

import { BACKEND_URL } from "@/config/app";
import { fetchProfile } from "../../../../api/profile/fetchprofile";
import { useState, useEffect } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams, useRouter } from "next/navigation";
import { AdminOwnerauthorizationcheck } from "../../../../api/authorizationcheck/admin-ownercheck";
import { motion } from "framer-motion";
import { Sparkles, Send, ShieldAlert } from "lucide-react";

type User = {
  Id: string
  Username: string
  Role: string
}

export default function Bio() {
  const [bio, setBio] = useState("No description available.");
  const [userData, setUserData] = useState<User | null>(null);
  const [errmsg, setErrmsg] = useState("");
  const router = useRouter();
  const [errdisplay, setErrdisplay] = useState("hidden");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchProfile(username);
        setBio(profileData.profile?.Bio || "No description available.");
        setUserData(profileData.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrmsg(`Error fetching profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    if (userData) {
      async function AuthorizationCheck() {
        const check = await AdminOwnerauthorizationcheck(userData!.Id);
        if (check?.allowed !== true) { router.push("/home"); }
      }
      AuthorizationCheck();
    }
  }, [userData, router]);

  async function handleUpdateDescription() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile/update/bio/${username}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bio");
      }

      await response.json();
      alert("Bio updated successfully!");
      setBio("");
    } catch (error) {
      console.error("Error updating bio:", error);
      setErrmsg(`Error updating bio:${error}`);
      setErrdisplay("fixed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (errdisplay === "fixed") {
    setTimeout(() => {
      setErrdisplay("hidden");
    }, 5000);
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="relative min-h-[80vh] w-full bg-[#050000] text-white rounded-3xl overflow-hidden border border-[#2d0202] shadow-[0_0_50px_rgba(153,27,27,0.15)] flex items-center justify-center p-4 sm:p-8 md:p-12 selection:bg-red-600 selection:text-white">

        {/* 100% Lag-Free Ambient Background (CSS Hardware Accelerated) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-red-900/20 to-transparent rounded-full blur-[140px] will-change-transform" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-[#660000]/20 to-transparent rounded-full blur-[140px] will-change-transform" />
        </div>

        <ErrorPopup message={errmsg} display={errdisplay} />

        {/* Main Glass Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl bg-gradient-to-b from-[#120101]/90 to-[#0a0000]/95 backdrop-blur-md border border-[#3a0404] rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
        >
          {/* Top Header Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2d0202] pb-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-b from-red-600 to-[#800000] flex items-center justify-center border border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  Update Bio
                </h1>
                <p className="text-xs text-red-500/70 tracking-wide mt-0.5 font-medium">
                  Editing node: <span className="text-white font-mono bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/30">@{username}</span>
                </p>
              </div>
            </div>

            {userData && (
              <div className="self-start sm:self-center px-3 py-1 rounded-md text-[10px] font-black bg-white text-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-red-600" />
                {userData.Role}
              </div>
            )}
          </div>

          {/* Form Elements */}
          <div className="space-y-6">
            <div className="flex flex-col gap-2.5">
              <label className="text-[11px] font-black tracking-widest text-red-500 uppercase">
                Biography Content
              </label>
              <div className="relative group">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0a0000] border border-[#3a0404] focus:border-red-600 rounded-xl p-4 text-white placeholder-red-950 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all duration-300 text-sm leading-relaxed tracking-wide shadow-inner"
                  placeholder="No description available."
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-red-700 font-mono tracking-wider font-bold bg-[#050000] px-1.5 py-0.5 rounded border border-[#2d0202]">
                  {bio?.length || 0} CHR
                </div>
              </div>
            </div>

            {/* Premium Crimson Button */}
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#e11d48" }}
              whileTap={{ scale: 0.99 }}
              onClick={handleUpdateDescription}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 text-xs shadow-[0_4px_20px_rgba(220,38,38,0.25)] border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Commit Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}