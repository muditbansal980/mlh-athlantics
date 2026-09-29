"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  Monitor,
  Users,
  Globe,
  IndianRupee,
  Clock,
  CalendarRange,
  UserCheck,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { type Contest } from "./contestData";
import { BACKEND_URL } from "@/config/app";

// ── Pure helpers ───────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatPrice = (fee: number) =>
  fee === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fee);

const isRegistrationOpen = (start: string, end: string) => {
  const now = Date.now();
  return now >= new Date(start).getTime() && now <= new Date(end).getTime();
};

const modeColor = (mode: string) => {
  if (mode === "Online") return "bg-blue-50  border-blue-200  text-blue-700";
  if (mode === "Offline") return "bg-lime-50  border-lime-200  text-lime-700";
  return "bg-purple-50 border-purple-200 text-purple-700";
};

// ── Page Component ─────────────────────────────────────────────────────────
export default function ContestDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error404, setError404] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    async function fetchContest() {
      try {
        // Pointing directly to your client-facing public secure API URL
        const res = await fetch(`${BACKEND_URL}/api/contest/${id}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
          // Tells the browser to natively pass cookies alongside the request
          credentials: "include", 
        });

        if (res.status === 404 || !res.ok) {
          setError404(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!data) {
          setError404(true);
        } else {
          setContest(data);
        }
      } catch (err) {
        console.error("Error fetching contest on client:", err);
        setError404(true);
      } finally {
        setLoading(false);
      }
    }
    fetchContest();
  }, [id]);

  if (error404) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-semibold tracking-wide">Loading contest details...</p>
        </div>
      </div>
    );
  }

  // Double check constraint safety fallback
  if (!contest) return null;
  // console.log("Contest data fetched:", contest);

  const regOpen = isRegistrationOpen(
    contest.RegistrationStartDate,
    contest.RegistrationEndDate
  );

  return (
    <div className="min-h-dvh bg-gray-50 font-sans">

      {/* ── TOPBAR ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">

          <Link
            href="/contests"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={15} />
            Contests
          </Link>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/contests" className="hover:text-lime-600 transition-colors font-medium">
              Contests
            </Link>
            <span>/</span>
            <span className="text-gray-500 font-medium truncate max-w-xs">
              {contest.Title}
            </span>
          </div>

          {/* Register CTA — topbar shortcut */}
          {regOpen && (
            <div onClick={() => router.push(`/contests/${id}/register`)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 text-black text-xs font-bold">
              <CheckCircle size={12} />
              Register Now
            </div>
          )}

        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Category + mode pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 border border-lime-200 text-lime-700 text-xs font-bold uppercase tracking-wide">
              <Tag size={10} />
              {contest.Category}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${modeColor(contest.Mode)}`}>
              <Monitor size={10} />
              {contest.Mode}
            </span>
            {contest.Fee === 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-wide">
                Free Entry
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
            {contest.Title}
          </h1>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
            <MapPin size={14} className="text-lime-500 flex-shrink-0" />
            {contest.Location}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {contest.Description}
          </p>

        </div>

        {/* ── REGISTRATION STATUS BANNER ─────────────────────────── */}
        <div className={`rounded-2xl border p-4 flex items-start gap-3 ${regOpen
            ? "bg-lime-50 border-lime-200"
            : "bg-gray-50 border-gray-200"
          }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${regOpen ? "bg-lime-100" : "bg-gray-100"
            }`}>
            {regOpen
              ? <CheckCircle size={16} className="text-lime-600" />
              : <AlertCircle size={16} className="text-gray-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${regOpen ? "text-lime-700" : "text-gray-500"}`}>
              {regOpen ? "Registrations are currently open" : "Registrations are closed"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(contest.RegistrationStartDate)} — {formatDate(contest.RegistrationEndDate)}
            </p>
          </div>
          {contest.Fee > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400 font-medium">Entry Fee</p>
              <p className="text-lg font-black text-lime-600 leading-none mt-0.5">
                {formatPrice(contest.Fee)}
              </p>
            </div>
          )}
        </div>

        {/* ── DATE CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Event dates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-lime-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Event Dates
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Start</span>
                <span className="text-xs font-bold text-gray-800">
                  {formatDateTime(contest.EventStartDate)}
                </span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">End</span>
                <span className="text-xs font-bold text-gray-800">
                  {formatDateTime(contest.EventEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Registration dates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <CalendarRange size={14} className="text-blue-500" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Registration Window
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Opens</span>
                <span className="text-xs font-bold text-gray-800">
                  {formatDate(contest.RegistrationStartDate)}
                </span>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Closes</span>
                <span className="text-xs font-bold text-gray-800">
                  {formatDate(contest.RegistrationEndDate)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── DETAILS GRID ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

          <p className="px-5 pt-4 pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Contest Details
          </p>

          {/* Participation Type */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <UserCheck size={14} className="text-lime-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Participation Type</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {contest.ParticipationType}
              </p>
            </div>
          </div>

          {/* Team Size — only show if Team */}
          {contest.ParticipationType === "Team" && (
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <Users size={14} className="text-lime-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Team Size</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  {contest.TeamSize} members per team
                </p>
              </div>
            </div>
          )}

          {/* Mode */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Monitor size={14} className="text-lime-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Mode</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {contest.Mode}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-lime-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Location</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {contest.Location}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Tag size={14} className="text-lime-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Category</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {contest.Category}
              </p>
            </div>
          </div>

          {/* Fee */}
          <div className="flex items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <IndianRupee size={14} className="text-lime-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Entry Fee</p>
              <p className={`text-sm font-bold mt-0.5 ${contest.Fee === 0 ? "text-green-600" : "text-gray-800"
                }`}>
                {formatPrice(contest.Fee)}
              </p>
            </div>
          </div>

          {/* Website — only if present */}
          {contest.Website && (
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <Globe size={14} className="text-lime-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Official Website</p>
                <a
                  href={contest.Website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-lime-600 hover:text-lime-700 hover:underline transition-colors mt-0.5 flex items-center gap-1 truncate"
                >
                  {contest.Website}
                  <ExternalLink size={11} className="flex-shrink-0" />
                </a>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="flex items-center gap-3 px-5 py-3 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
              <Clock size={14} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium">Listed On</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">
                {formatDate(contest.CreatedAt)}
              </p>
            </div>
          </div>

        </div>

        {/* ── REGISTER CTA ──────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          {regOpen ? (
            <Link
              href={`/contests/${id}/register`}
              rel="noreferrer"
              className="w-full py-4 rounded-2xl bg-lime-400 text-black font-bold text-sm text-center hover:bg-lime-300 active:scale-95 transition-all shadow-sm shadow-lime-200"
            >
              Register Now
              {contest.Fee > 0 && ` — ${formatPrice(contest.Fee)}`}
            </Link>
          ) : (
            <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm text-center cursor-not-allowed">
              Registrations Closed
            </div>
          )}

          <Link
            href="/contests"
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Browse All Contests
          </Link>
        </div>
      </main>
    </div>
  );
}