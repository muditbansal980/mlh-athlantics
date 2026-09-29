"use client";

import { motion } from "framer-motion";
import { Users, Plus } from "lucide-react";

interface EmptyCoachStateProps {
    onAddCoach?: () => void;
}

export default function EmptyCoachState({
    onAddCoach,
}: EmptyCoachStateProps) {
    return (
        <motion.section
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.35,
            }}
            className="  flex  min-h-[420px]  flex-col  items-center  justify-center  rounded-3xl  border  border-dashed  border-neutral-300  bg-white  px-6  text-center"  >
            {/* Icon */}

            <div
                className="    flex    h-20    w-20    items-center    justify-center    rounded-full    bg-red-50  ">
                <Users
                    size={36}
                    className="text-red-600"
                />
            </div>

            {/* Heading */}

            <h2
                className="  mt-8  text-2xl  font-bold  tracking-tight  text-neutral-900">
                No coaches found
            </h2>

            {/* Description */}

            <p
                className=" mt-3 max-w-md leading-7 text-neutral-500 "     >
                Your coaching team is currently empty.
                Add your first coach to start assigning
                members and managing your fitness platform.
            </p>

            {/* CTA */}

        
        </motion.section>
    );
}