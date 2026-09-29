"use client";

import { Plus } from "lucide-react";
import React from "react";

type PageHeaderProps = {
    title: string;
    description: string;
    buttonText?: string;
    onButtonClick?: () => void;
    buttonIcon?: React.ReactNode;
};

export default function PageHeader({
    title,
    description,
    buttonText,
    onButtonClick,
    buttonIcon,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-gray-500">{description}</p>
            </div>

            {buttonText && (
                <button
                    onClick={onButtonClick}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white font-medium shadow-md transition-all duration-300 hover:bg-red-800 hover:shadow-lg active:scale-95"
                >
                    {buttonIcon ?? <Plus size={18} />}
                    {buttonText}
                </button>
            )}
        </div>
    );
}