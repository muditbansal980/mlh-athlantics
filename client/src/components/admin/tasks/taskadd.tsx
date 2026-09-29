"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/config/app";
import {
  ArrowLeft,
  CheckCircle,
  Zap,
  AlignLeft,
  Type,
  Loader2,
  Shield,
  Plus,
} from "lucide-react";

export default function AddTaskPage() {
  const router = useRouter();

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints]                 = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())             e.title       = "Title is required";
    if (title.trim().length > 100) e.title       = "Title must be under 100 characters";
    if (!description.trim())       e.description = "Description is required";
    if (!points)                   e.points      = "Points value is required";
    else if (isNaN(Number(points)) || Number(points) <= 0)
                                   e.points          = "Points must be a positive number";
    else if (Number(points) > 10000)   e.points          = "Points cannot exceed 10,000";
    return e;
  };

  const clearError = (field: string) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/tasks/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Title:       title.trim(),
          Description: description.trim(),
          Points:          Number(points),
        }),
        credentials: "include",
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setTitle("");
    setDescription("");
    setPoints("");
    setSuccess(false);
    setErrors({});
  };

  // ── Success screen ────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-lime-50 border-2 border-lime-400 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-lime-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            Task Created!
          </h2>
          <p className="text-sm text-gray-400 mb-1">
            <span className="font-semibold text-gray-700">{title}</span> is now live.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Users will earn{" "}
            <span className="font-bold text-lime-600">{Number(points).toLocaleString()} Points</span>{" "}
            on completion.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddAnother}
              className="w-full py-3 rounded-2xl bg-lime-400 text-black font-bold text-sm hover:bg-lime-300 active:scale-95 transition-all"
            >
              Add Another Task
            </button>
            <Link
              href="/admin/tasks"
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-semibold text-sm text-center hover:bg-gray-50 transition-all"
            >
              View All Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-gray-50 font-sans">

      {/* ── TOPBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">

          <Link
            href="/admin/tasks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all"
          >
            <ArrowLeft size={15} />
            Tasks
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-400 flex items-center justify-center flex-shrink-0">
              <Shield size={13} className="text-black" />
            </div>
            <span className="font-extrabold text-gray-900 text-base tracking-tight">
              Admin
            </span>
          </div>

          <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            Add Task
          </span>

        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-50 border border-lime-200 mb-4">
            <Plus size={12} className="text-lime-600" />
            <span className="text-xs font-bold text-lime-700 uppercase tracking-wide">
              New Task
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create a Task
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Users will see this task on their dashboard and earn XP on completion.
          </p>
        </div>

        {/* ── FORM ────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Form error */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
              {errors.form}
            </div>
          )}

          {/* Card wrapper */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

            {/* ── TITLE ─────────────────────────────────────── */}
            <div className="p-5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                <Type size={12} className="text-lime-500" />
                Title
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); clearError("title"); }}
                placeholder="e.g. Complete 20 push-ups in one set"
                maxLength={100}
                className={[
                  "w-full px-4 py-3 rounded-xl text-sm text-gray-900 bg-gray-50 border transition-all outline-none",
                  "placeholder-gray-300 font-medium",
                  errors.title
                    ? "border-red-300 focus:border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-lime-400 focus:bg-white",
                ].join(" ")}
              />
              <div className="flex justify-between items-center mt-2">
                {errors.title ? (
                  <p className="text-xs text-red-500 font-medium">{errors.title}</p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Keep it short and action-oriented
                  </p>
                )}
                <span className={[
                  "text-xs font-semibold",
                  title.length > 80 ? "text-orange-400" : "text-gray-300",
                ].join(" ")}>
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* ── DESCRIPTION ───────────────────────────────── */}
            <div className="p-5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                <AlignLeft size={12} className="text-lime-500" />
                Description
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); clearError("description"); }}
                placeholder="Describe what the user needs to do, how it will be verified, and any rules or conditions..."
                rows={5}
                className={[
                  "w-full px-4 py-3 rounded-xl text-sm text-gray-900 bg-gray-50 border transition-all outline-none resize-none",
                  "placeholder-gray-300 leading-relaxed",
                  errors.description
                    ? "border-red-300 focus:border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-lime-400 focus:bg-white",
                ].join(" ")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            {/* ── XP ────────────────────────────────────────── */}
            <div className="p-5">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                <Zap size={12} className="text-lime-500" />
                XP Reward
                <span className="text-red-400">*</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Zap size={14} className="text-lime-500" />
                  </div>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => { setPoints(e.target.value); clearError("points"); }}
                    placeholder="0"
                    min={1}
                    max={10000}
                    className={[
                      "w-full pl-9 pr-4 py-3 rounded-xl text-sm font-bold text-gray-900 bg-gray-50 border transition-all outline-none",
                      errors.xp
                        ? "border-red-300 focus:border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-lime-400 focus:bg-white",
                    ].join(" ")}
                  />
                </div>
                <span className="text-sm font-bold text-gray-400 flex-shrink-0">
                  XP points
                </span>
              </div>

              {errors.xp ? (
                <p className="text-xs text-red-500 font-medium mt-2">{errors.xp}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Between 1 and 10,000 XP
                </p>
              )}

              {/* XP quick pick buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[50, 100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setPoints(String(val)); clearError("points"); }}
                    className={[
                      "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                      points === String(val)
                        ? "bg-lime-400 border-lime-400 text-black"
                        : "bg-white border-gray-200 text-gray-500 hover:border-lime-300 hover:text-lime-600",
                    ].join(" ")}
                  >
                    {val} Points  
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── PREVIEW CARD ──────────────────────────────────── */}
          {(title || description || points) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Preview — how users will see this task
              </p>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {title || "Task title…"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                    {description || "Task description…"}
                  </p>
                </div>
                {points && Number(points) > 0 && (
                  <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-50 border border-lime-200">
                    <Zap size={11} className="text-lime-600" />
                    <span className="text-xs font-black text-lime-700">
                      +{Number(points).toLocaleString()} Points
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── SUBMIT ────────────────────────────────────────── */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className={[
                "w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                submitting
                  ? "bg-lime-200 text-lime-600 cursor-not-allowed"
                  : "bg-lime-400 text-black hover:bg-lime-300 active:scale-95 shadow-sm shadow-lime-200",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Task…
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Task
                </>
              )}
            </button>
            <Link
              href="/admin/tasks"
              className="w-full py-3 rounded-2xl border border-gray-200 text-gray-500 font-semibold text-sm text-center hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Cancel
            </Link>
          </div>

        </form>
      </main>
    </div>
  );
}