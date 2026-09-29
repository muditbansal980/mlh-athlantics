"use client";

import { Mail, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface CoachCardFooterProps {
  email?: string;
  createdAt: string;
}

export default function CoachCardFooter({
  email,
  createdAt,
}: CoachCardFooterProps) {
  return (
    <footer className="space-y-4">
      {/* Email */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-neutral-100
          "
        >
          <Mail
            size={16}
            className="text-neutral-500"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-400">
            Email
          </p>

          <p
            className="
              truncate
              text-sm
              font-medium
              text-neutral-700
            "
          >
            {email || "Not Available"}
          </p>
        </div>
      </div>

      {/* Join Date */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-neutral-100
          "
        >
          <CalendarDays
            size={16}
            className="text-neutral-500"
          />
        </div>

        <div>
          <p className="text-xs text-neutral-400">
            Joined
          </p>

          <p
            className="
              text-sm
              font-medium
              text-neutral-700
            "
          >
            {format(
              new Date(createdAt),
              "dd MMM yyyy"
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}