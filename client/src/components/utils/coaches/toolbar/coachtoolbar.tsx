"use client";

import { motion } from "framer-motion";
import SearchBar from "./searchbar";
import FilterDropdown from "./filterdropdown";
import SortDropdown from "./sortdown";

interface CoachToolbarProps {
  search: string;
  onSearch: (value: string) => void;

  filter: string;
  onFilter: (value: string) => void;

  sort: string;
  onSort: (value: string) => void;
}

export default function CoachToolbar() {
// export default function CoachToolbar({
//   search,
//   onSearch,

//   filter,
//   onFilter,

//   sort,
//   onSort,
// }: CoachToolbarProps) {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.1,
      }}
      className="     mb-8     rounded-3xl     border     border-neutral-200     bg-white     p-5     shadow-sm   " >
      <div
        className="    grid    gap-4    lg:grid-cols-[1.8fr_0.8fr_0.8fr]  ">
        {/* <SearchBar
          value={search}
          onChange={onSearch}
        />

        <FilterDropdown
          value={filter}
          onChange={onFilter}
        />

        <SortDropdown
          value={sort}
          onChange={onSort}
        /> */}
        <SearchBar />
        <FilterDropdown />
        <SortDropdown />
      </div>
    </motion.section>
  );
}