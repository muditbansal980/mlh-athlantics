"use client";

import { Filter } from "lucide-react";

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

// export default function FilterDropdown({
//   value,
//   onChange,
// }: FilterDropdownProps) {

export default function FilterDropdown() {
  return (
    <div className="relative w-full">
      <Filter
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />

      <select
        // value={value}
        // onChange={(e) => onChange(e.target.value)}
        className="   h-12   w-full   appearance-none   rounded-2xl   border   border-neutral-200   bg-white   pl-11   pr-8   text-sm   outline-none   transition-all   focus:border-red-500   focus:ring-4   focus:ring-red-100 ">
        <option value="all">All Coaches</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}