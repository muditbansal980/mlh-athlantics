"use client";

import { useEffect, useState } from "react";
import { Search, X, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
interface ProfileSearchBarProps {
  onSearch?: (query: string) => void;
  usernames: Array<{ Username: string }>;
}

export default function ProfileSearchBar({ onSearch, usernames }: ProfileSearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [filteredUsernames, setFilteredUsernames] = useState<{ Username: string }[]>([]);
  useEffect(()=>{
    setFilteredUsernames(usernames)

  },[usernames])
  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };
  // console.log("Filtered Usernames:", filteredUsernames);
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-4">
      <div className="relative bg-[#09090f]/90 border border-neutral-900 rounded-xl overflow-hidden shadow-xl backdrop-blur-md transition-all duration-300 focus-within:border-red-900/60 focus-within:shadow-[0_0_20px_rgba(220,38,38,0.05)]">
        {/* Left Matrix Line Accent */}
        <div className="absolute left-0 top-0 w-[2px] h-full bg-red-600/50" />

        <div className="flex items-center gap-3 px-4 py-3">
          {/* Terminal / Search Icons */}
          <div className="flex items-center gap-1.5 shrink-0 text-neutral-500">
            <Terminal size={14} className="text-red-600/70 hidden sm:block" />
            <Search size={16} className="text-neutral-400" />
          </div>

          {/* Form Input */}
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Find athletes .."
            className="w-full bg-transparent text-xs sm:text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none tracking-wide uppercase selection:bg-red-700 selection:text-white"
          />

          {/* Control Triggers */}
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                onClick={handleClear}
                className="p-1 rounded bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600/50 transition-colors cursor-pointer"
                title="Clear query"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
      {
        query && filteredUsernames.length > 0 && (
          <div className="mt-2 bg-[#09090f]/90 border border-neutral-900 rounded-xl overflow-hidden shadow-xl backdrop-blur-md transition-all duration-300">
            {filteredUsernames.map((name: { Username: string }) => (
              <div onClick={() => router.push(`/profile/${name.Username}`)} key={name.Username} className="px-4 py-2 text-sm text-neutral-200 hover:bg-red-600/10 cursor-pointer">
                {name.Username}
              </div>
            ))}
          </div>
        ) 
      }
      {
        query && filteredUsernames.length === 0 && (
          <div className="mt-2 bg-[#09090f]/90 border border-neutral-900 rounded-xl overflow-hidden shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="px-4 py-2 text-sm text-neutral-500">
              No results found for "{query}"
            </div>
          </div>
        )
      }
    </div>
  );
}