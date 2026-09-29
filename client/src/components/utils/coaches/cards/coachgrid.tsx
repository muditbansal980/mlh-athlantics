"use client";

import { AnimatePresence, motion } from "framer-motion";
import CoachCard from "./coachcard";
import { useRouter } from "next/navigation";
import {Coach} from "../../../../types/coaches/coachprofiledata"
interface CoachGridProps {
  coaches: Coach[];
}

export default function CoachGrid({
  coaches,
}: CoachGridProps) {
  const router = useRouter();
  return (
    <AnimatePresence mode="wait">
      <motion.section
        layout
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className=" grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 " >
        {coaches.map((coach, index) => (
          <motion.div
            key={coach.Id}
            layout
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            onClick={() => router.push(`/profile/coach/${coach.Id}`)}
          >
            <CoachCard coach={coach} />
          </motion.div>
        ))}
      </motion.section>
    </AnimatePresence>
  );
}