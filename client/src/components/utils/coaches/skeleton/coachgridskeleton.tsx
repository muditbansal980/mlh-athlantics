"use client";

/**
 * Skeleton card displayed while coaches are loading.
 *
 * Designed to closely match CoachCard.tsx
 * to prevent layout shifts.
 */

export default function CoachCardSkeleton() {
    return (
        <article
            className="  relative  overflow-hidden  rounded-3xl  border  border-neutral-200  bg-white  p-6  shadow-sm"  >
            {/* Shimmer Overlay */}
            <div
                className="  pointer-events-none  absolute  inset-0  -translate-x-full  animate-shimmer  bg-gradient-to-r  from-transparent  via-white/60  to-transparent"    />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-16 w-16 rounded-full bg-neutral-200 animate-pulse" />

                    {/* Title */}
                    <div className="flex-1">
                        <div className="h-5 w-40 rounded bg-neutral-200 animate-pulse" />

                        <div className="mt-3 h-4 w-24 rounded bg-neutral-100 animate-pulse" />
                    </div>
                </div>

                {/* Description */}
                <div className="mt-7 space-y-3">
                    <div className="h-4 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-4 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-neutral-100 animate-pulse" />
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-neutral-100" />

                {/* Footer */}
                <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-neutral-200 animate-pulse" />

                        <div className="flex-1">
                            <div className="h-3 w-12 rounded bg-neutral-100 animate-pulse" />

                            <div className="mt-2 h-4 w-44 rounded bg-neutral-200 animate-pulse" />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-neutral-200 animate-pulse" />

                        <div className="flex-1">
                            <div className="h-3 w-16 rounded bg-neutral-100 animate-pulse" />

                            <div className="mt-2 h-4 w-32 rounded bg-neutral-200 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}