"use client";

import { motion } from "framer-motion";
import { Mail, CalendarDays } from "lucide-react";
import { format } from "date-fns";

/**
 * Coach model
 * Extend this later if your backend returns
 * avatar, phone, status etc.
 */
import {Coach} from "../../../../types/coaches/coachprofiledata"

interface CoachCardProps {
  coach: Coach;
}

export default function CoachCard({
  coach,
}: CoachCardProps) {
  /**
   * Avatar fallback
   * Uses first letter when no image exists.
   */
  const initials = coach.CoachName.charAt(0).toUpperCase();

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group

        flex
        flex-col

        rounded-3xl

        border
        border-neutral-200

        bg-white

        p-6

        shadow-sm

        transition-all
        duration-300

        hover:border-red-100
        hover:shadow-xl
      "
    >
      {/* ==========================
          Header
      =========================== */}
      <div className="flex items-center gap-4">
        {coach.AvatarUrl ? (
          <img
            src={coach.AvatarUrl}
            alt={coach.CoachName}
            className="
              h-16
              w-16
              rounded-full
              object-cover
              border-2
              border-white
              shadow-md
            "
          />
        ) : (
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center

              rounded-full

              bg-red-50

              text-xl
              font-bold

              text-red-600
            "
          >
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <h2
            className="
              truncate

              text-xl
              font-semibold
              tracking-tight

              text-neutral-900
            "
          >
            {coach.CoachName}
          </h2>

          <p
            className="
              mt-1

              text-sm

              font-medium

              text-red-600
            "
          >
            Coach
          </p>
        </div>
      </div>

      {/* ==========================
          Description
      =========================== */}
      <div className="mt-6 flex-1">
        <p
          className="
            line-clamp-3

            leading-7

            text-neutral-600
          "
        >
          {coach.Description}
        </p>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-neutral-100" />

      {/* ==========================
          Footer
      =========================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {/* <Mail
            size={18}
            className="text-neutral-400"
          /> */}

          {/* <span
            className="
              truncate

              text-sm

              text-neutral-500
            "
          >
            {coach.Email || "No email available"}
          </span> */}
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-neutral-400"
          />

          <span
            className="
              text-sm

              text-neutral-500
            "
          >
            Joined{" "}
            {format(
              new Date(coach.CreatedAt),
              "dd MMM yyyy"
            )}
          </span>
        </div>
      </div>
    </motion.article>
  );
}