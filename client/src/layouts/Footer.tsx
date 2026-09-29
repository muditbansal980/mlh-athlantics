"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import Instagram from "../../assets/instagram-logo.png";
import Linkedin from "../../assets/linkedin-logo.png";
import { SOCIAL_LINKS } from "@/constants/layouts";
import { SIDEBAR_NAV } from "@/constants/layouts";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <Image
      src={Instagram}
      alt="Instagram"
      width={14}
      height={14}
      className="w-3.5 h-3.5 object-contain invert"
    />
  ),
  Discord: <MessageSquare size={14} />,
  LinkedIn: (
    <Image
      src={Linkedin}
      alt="LinkedIn"
      width={14}
      height={14}
      className="w-3.5 h-3.5 object-contain invert"
    />
  ),
};

export default function Footer() {
  return (
    <footer className="bg-[#201C1C] text-[#EEEDED] border-t border-neutral-900 mt-auto font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 pb-10">

          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-black text-white text-2xl tracking-tighter uppercase font-sans">
                  Athlan<span className="text-[#EA3A3A] font-serif italic lowercase tracking-normal">tic</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-sans font-medium">
                Train smarter. Rank higher. Win more. The definitive computational performance workspace for high-performance athletes.
              </p>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">
              System Nodes
            </p>
            <div className="flex flex-col gap-2.5">
              {SIDEBAR_NAV.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-xs text-neutral-300 hover:text-[#EA3A3A] transition-colors uppercase font-bold tracking-tight"
                >
                   {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community/Social Column */}
          <div className="md:col-span-3">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-4">
              Network Base
            </p>
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-neutral-300 hover:text-[#EA3A3A] transition-colors font-bold tracking-tight"
                >
                  <span className="text-neutral-500 group-hover:text-[#EA3A3A] transition-colors">
                    {SOCIAL_ICONS[s.label]}
                  </span>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* System Credentials & Utility Sub-Links Row */}
        <div className="border-t border-neutral-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
          <p>
            © 2026 Athlantic Core. All values synchronized.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase()}`}
                className="hover:text-[#EA3A3A] text-neutral-400 transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}