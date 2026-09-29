"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddCoachButtonProps {
  onClick?: () => void;
}

export default function AddCoachButton({
  onClick,
}: AddCoachButtonProps) {
  return (
    <motion.button
      whileHover={{
        y: -2,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      onClick={onClick}
      className=" inline-flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-5 py-3 text-white font-medium shadow-sm hover:shadow-lg transition-colors " >
      <Plus size={18} />

      <span>Add Coach</span>
    </motion.button>
  );
}