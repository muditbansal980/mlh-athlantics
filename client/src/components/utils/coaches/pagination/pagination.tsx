"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CoachPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CoachPagination() {
// export default function CoachPagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: CoachPaginationProps) {
  const pages = ["1", "2", "3", "4", "5"];

//   for (let i = 1; i <= totalPages; i++) {
//     pages.push(i);
//   }

  return (
    <nav
      className="   mt-12     flex     flex-wrap     items-center     justify-center     gap-2   " >
      {/* Previous */}

      <button
        // onClick={() =>
        //   onPageChange(currentPage - 1)
        // }
        // disabled={currentPage === 1}
        className="    flex    h-11    w-11    items-center    justify-center    rounded-xl    border    transition   disabled:cursor-not-allowed    disabled:opacity-40    hover:bg-neutral-100  ">
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
        //   onClick={() => onPageChange(page)}
        //   className={`    h-11    w-11    rounded-xl    border    font-medium    transition    ${      page === currentPage        ? "border-red-600 bg-red-600 text-white shadow-md"        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"    }  `}>
          className={`    h-11    w-11    rounded-xl    border    font-medium    transition    "border-red-600 bg-red-600 text-white shadow-md"          `}>
          {page}
        </button>
      ))}

      {/* Next */}

      <button
        // onClick={() =>
        //   onPageChange(currentPage + 1)
        // }
        // disabled={currentPage === totalPages}
        className=" flex h-11 w-11 items-center justify-center      rounded-xl      border      transition      disabled:cursor-not-allowed      disabled:opacity-40      hover:bg-neutral-100    "  >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}