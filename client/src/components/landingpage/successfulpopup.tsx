"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function SuccessPopup({
  open,
  onClose,
  title = "Feedback Submitted",
  description = "Thank you for helping us improve Athlantic.",
}: SuccessPopupProps) {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999]"
          />

          {/* Popup */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
          >
            <div className="relative w-full max-w-md rounded-[36px] bg-[#201C1C] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] overflow-hidden">

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#EA3A3A]/20 via-transparent to-transparent pointer-events-none" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 text-white/40 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="relative px-10 py-12 text-center">

                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 180,
                  }}
                  className="mx-auto mb-8"
                >
                  <div className="relative w-24 h-24 rounded-full bg-[#EA3A3A]/10 flex items-center justify-center mx-auto">

                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="absolute inset-0 rounded-full border border-[#EA3A3A]/40"
                    />

                    <CheckCircle2
                      size={52}
                      className="text-[#EA3A3A]"
                    />
                  </div>
                </motion.div>

                <p className="text-[10px] uppercase tracking-[0.45em] font-black text-[#EA3A3A] mb-3">
                  Transmission Complete
                </p>

                <h2 className="text-3xl font-black uppercase text-white tracking-tight mb-4">
                  {title}
                </h2>

                <p className="text-white/60 leading-relaxed">
                  {description}
                </p>

                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                  }}
                  className="h-[3px] bg-[#EA3A3A] mt-10 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}