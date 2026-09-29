"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ErrorPopup({
  message,
  display,
}: {
  display: string; // "fixed" shows it, "hidden" hides it — unchanged
  message: string;
}) {
  const isVisible = display !== "hidden";

  return (
    <div
      className={`${display} top-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,380px)]`}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            role="alert"
            aria-live="assertive"
            className="relative"
          >
            {/* Crimson glow — pops on both light and dark pages */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-rose-600/40 via-red-600/20 to-transparent blur-md" />

            {/* Glass surface: white-ish on light sites, near-black on dark sites */}
            <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-white/90 text-neutral-900 shadow-2xl backdrop-blur-xl dark:bg-neutral-950/85 dark:text-neutral-100">
              {/* Crimson accent stripe */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-500 to-rose-700" />

              <div className="flex items-start gap-3 p-4 pl-5">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400"
                >
                  <AlertTriangle className="h-5 w-5" />
                </motion.div>

                <div className="flex-1">
                  <h2 className="text-sm font-semibold tracking-tight text-red-600 dark:text-red-400">
                    Error
                  </h2>
                  <p className="mt-0.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {message}
                  </p>
                </div>
              </div>

              {/* 5s timeline — shrinks linearly to indicate lifetime */}
              <div className="relative h-1 w-full bg-neutral-900/10 dark:bg-white/10">
                <motion.div
                  key={`bar-${message}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-700"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
