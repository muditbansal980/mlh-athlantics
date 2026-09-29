"use client";

import { motion } from "framer-motion";
// import AddCoachButton from "./addcoachbutton";

interface CoachPageHeaderProps {
  onAddCoach?: () => void;
}

// export default function CoachPageHeader({
//   onAddCoach,
// }: CoachPageHeaderProps) {
export default function CoachPageHeader() {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className=" flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
      {/* Left Side */}
      <div className="max-w-2xl">

        <h1
          className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          All Coaches
        </h1>

        <p
          className="mt-3 text-base leading-7 text-neutral-500 sm:text-lg">
          Browse and manage your coaching team.
          Review profiles, invite new coaches,
          and keep everything organized from one place.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex-shrink-0">
        {/* <AddCoachButton */}
        {/* //   onClick={onAddCoach} */}
        {/* /> */}
      </div>
    </motion.section>
  );
}