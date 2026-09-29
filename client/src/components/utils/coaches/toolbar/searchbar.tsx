"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// export default function SearchBar({
//   value,
//   onChange,
// }: SearchBarProps) {

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <input
        // value={value}
        // onChange={(e) => onChange(e.target.value)}
        placeholder="Search coaches..."
        className="     h-12     w-full     rounded-2xl     border     border-neutral-200     bg-white     pl-11     pr-4     text-sm     text-neutral-800     placeholder:text-neutral-400     outline-none     transition-all     duration-200     focus:border-red-500     focus:ring-4     focus:ring-red-100   " />
    </div>
  );
}