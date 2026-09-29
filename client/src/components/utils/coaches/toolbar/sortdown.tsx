"use client";

import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown() {
// export default function SortDropdown({
//   value,
//   onChange,
// }: SortDropdownProps) {
  return (
    <div className="relative w-full">
      <ArrowUpDown
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <select
        // value={value}
        // onChange={(e) => onChange(e.target.value)}
        className="     h-12     w-full     appearance-none     rounded-2xl     border     border-neutral-200     bg-white     pl-11     pr-8     text-sm     outline-none     transition-all     focus:border-red-500     focus:ring-4     focus:ring-red-100   " >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>
    </div>
  );
}