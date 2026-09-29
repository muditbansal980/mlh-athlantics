"use client";

type StatCardProps = {
    title: string;
    value: number | string;
};

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="mt-2 text-4xl font-bold text-red-700">{value}</h2>
        </div>
    );
}