"use client";

import React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-700 hover:shadow-xl ${className}`}>
            {children}
        </div>
    );
}