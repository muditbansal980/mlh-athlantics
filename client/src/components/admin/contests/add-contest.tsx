"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {useEffect} from "react";
import { adminOrgCheck } from "../../../../api/authorizationcheck/adminorgcheck";
import { BACKEND_URL } from "@/config/app";

const SPORT_CATEGORIES = [
    "Athletics", "Football", "Basketball", "Cricket", "Tennis",
    "Swimming", "Martial Arts", "Gymnastics", "Badminton", "Volleyball",
    "Cycling", "Wrestling", "Boxing", "Table Tennis", "Archery", "Other",
];

interface FormData {
    Title: string;
    Description: string;
    RegistrationUrl: string;
    OfficialWebsite: string;
    RegistrationStartDate: string;
    RegistrationEndDate: string;
    SportCategory: string;
    ParticipationType: "Solo" | "Team";
    EventStartDate: string;
    EventEndDate: string;
    Location: string;
    Mode: "Online" | "Offline" | "Hybrid";
    Fee: string;
    TeamSize: string;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
            {children} {required && <span className="text-lime-400">*</span>}
        </label>
    );
}

function Input({
    value, onChange, placeholder, type = "text", required
}: {
    value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; required?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-lime-400/50 focus:bg-lime-400/5 transition-all duration-200"
        />
    );
}

function Select({
    value, onChange, children, required
}: {
    value: string; onChange: (v: string) => void;
    children: React.ReactNode; required?: boolean;
}) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            required={required}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-lime-400/50 focus:bg-lime-400/5 transition-all duration-200 appearance-none"
        >
            {children}
        </select>
    );
}

function SegmentControl({
    value, onChange, options
}: {
    value: string;
    onChange: (v: string) => void;
    options: { label: string; value: string; icon: string }[];
}) {
    return (
        <div className="flex gap-2">
            {options.map(o => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 border
            ${value === o.value
                            ? "bg-lime-400 text-black border-lime-400 shadow-lg shadow-lime-400/20"
                            : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/70"
                        }`}
                >
                    <span>{o.icon}</span> {o.label}
                </button>
            ))}
        </div>
    );
}

// ── Success Screen ────────────────────────────────────────────────────────
function SuccessScreen({ title }: { title: string }) {
    const router = useRouter();
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(8,12,8,0.97)", backdropFilter: "blur(20px)" }}>

            {/* Back button */}
            <button
                onClick={() => router.push("/admin/contest/add")}
                className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl
          border border-white/10 bg-white/5 text-white/60 hover:text-white
          hover:border-white/20 hover:bg-white/10 transition-all text-sm font-semibold"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
            </button>

            <div className="text-center px-8 max-w-md">
                {/* Animated ring */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-lime-400/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-lime-400/40" />
                    <div className="absolute inset-0 rounded-full bg-lime-400/10 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2">
                            <polyline points="20,6 9,17 4,12" />
                        </svg>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                    <span className="text-lime-400 text-xs font-bold tracking-widest uppercase">Contest Published</span>
                </div>

                <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                    "{title}"
                </h2>
                <p className="text-white/40 text-sm leading-relaxed mb-8">
                    Contest has been successfully added to the platform. Athletes can now discover and register.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/admin/contest/add")}
                        className="flex-1 py-3 rounded-xl font-bold text-black bg-lime-400
              hover:bg-lime-300 transition-all shadow-lg shadow-lime-400/20 text-sm"
                    >
                        Add Another →
                    </button>
                    <button
                        onClick={() => router.push("/home")}
                        className="flex-1 py-3 rounded-xl font-bold text-white/70 border border-white/10
              hover:border-white/20 hover:text-white transition-all text-sm"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AddContestPage() {
    const router = useRouter();
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [RegistrationUrl, setRegistrationUrl] = useState("");
    const [OfficialWebsite, setOfficialWebsite] = useState("");
    const [RegistrationStartDate, setRegistrationStartDate] = useState("");
    const [RegistrationEndDate, setRegistrationEndDate] = useState("");
    const [SportCategory, setSportCategory] = useState("");
    const [ParticipationType, setParticipationType] = useState<"Solo" | "Team">("Solo");
    const [EventStartDate, setEventStartDate] = useState("");
    const [EventEndDate, setEventEndDate] = useState("");
    const [Location, setLocation] = useState("");
    const [Mode, setMode] = useState<"Online" | "Offline" | "Hybrid">("Offline");
    const [Fee, setFee] = useState("");
    const [TeamSize, setTeamSize] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        const checkAdminOrg = async () => {
            const data = await adminOrgCheck();
            if (!data.isAdminOrg) {
                router.push("/home"); // Redirect to home if not admin/org
            }
        };
        checkAdminOrg();
    }, []);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // console.log("Submitting contest data:", {
            //     Title,
            //     Description,
            //     RegistrationUrl,
            //     OfficialWebsite,
            //     RegistrationStartDate,
            //     RegistrationEndDate,
            //     SportCategory,
            //     ParticipationType,
            //     EventStartDate,
            //     EventEndDate,
            //     Location,
            //     Mode,
            //     Fee,
            //     TeamSize,
            // });
            const res = await fetch(`${BACKEND_URL}/api/contest/add`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({
                    Title: Title,
                    Description: Description,
                    RegistrationUrl: RegistrationUrl,
                    OfficialWebsite: OfficialWebsite,
                    RegistrationStartDate: RegistrationStartDate,
                    RegistrationEndDate: RegistrationEndDate,
                    SportCategory: SportCategory,
                    ParticipationType: ParticipationType,
                    EventStartDate: EventStartDate,
                    EventEndDate: EventEndDate,
                    Location: Location,
                    Website: OfficialWebsite || null,
                    Mode: Mode,
                    Fee: Fee === "" ? 0 : Number(Fee),
                    TeamSize: TeamSize === "" ? null : Number(TeamSize),
                }),

            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message ?? "Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (success) return <SuccessScreen title={Title} />;

    return (
        <div className="min-h-dvh text-white" style={{ background: "#080c08", fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
            {/* <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        // * { box-sizing: border-box; }
        select option { background: #0e150e; color: white; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
      `}</style> */}

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/10" style={{ background: "rgba(8,12,8,0.9)", backdropFilter: "blur(16px)" }}>
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center font-black text-black text-sm">A</div>
                        <span className="font-extrabold text-base tracking-tight">
                            Athlan<span className="text-lime-400">tic</span>
                            <span className="text-white/20 font-normal mx-2">/</span>
                            <span className="text-white/50 font-semibold text-sm">Add Contest</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-10">

                {/* Page title */}
                <div className="mb-10">
                    <span className="text-lime-400 text-xs font-bold tracking-widest uppercase">Contest Management</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mt-2 mb-2">Add New Contest</h1>
                    <p className="text-white/40 text-sm">Fill in the details below to publish a contest on the platform.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* ── Section: Basic Info ── */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/25 flex items-center justify-center text-sm">📋</div>
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white/60">Basic Info</h2>
                        </div>

                        <div>
                            <Label required>Contest Title</Label>
                            <Input value={Title} onChange={setTitle} placeholder="e.g. National Athletics Championship 2025" required />
                        </div>

                        <div>
                            <Label required>Description</Label>
                            <textarea
                                value={Description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe the contest, rules, eligibility, prizes..."
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 resize-none focus:outline-none focus:border-lime-400/50 focus:bg-lime-400/5 transition-all duration-200"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label required>Sport Category</Label>
                                <Select value={SportCategory} onChange={setSportCategory} required>
                                    <option value="" disabled>Select sport...</option>
                                    {SPORT_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                                </Select>
                            </div>

                            <div>
                                <Label required>Participation Type</Label>
                                <SegmentControl
                                    value={ParticipationType}
                                    onChange={value => setParticipationType(value as "Solo" | "Team")}
                                    options={[
                                        { label: "Solo", value: "Solo", icon: "🏃" },
                                        { label: "Team", value: "Team", icon: "👥" },
                                    ]}
                                />
                            </div>
                        </div>

                        {ParticipationType === "Team" && (
                            <div className="max-w-xs">
                                <Label>Team Size</Label>
                                <Input value={TeamSize} onChange={setTeamSize} placeholder="e.g. 5" type="number" />
                            </div>
                        )}
                    </div>

                    {/* ── Section: Links ── */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/25 flex items-center justify-center text-sm">🔗</div>
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white/60">Links</h2>
                        </div>

                        <div>
                            <Label required>Registration URL</Label>
                            <Input value={RegistrationUrl} onChange={setRegistrationUrl} placeholder="https://register.example.com" type="url" required />
                        </div>

                        <div>
                            <Label>Official Website <span className="text-white/20 normal-case font-normal tracking-normal">(optional)</span></Label>
                            <Input value={OfficialWebsite} onChange={setOfficialWebsite} placeholder="https://organizingbody.org" type="url" />
                        </div>
                    </div>

                    {/* ── Section: Dates ── */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/25 flex items-center justify-center text-sm">📅</div>
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white/60">Dates</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label required>Registration Start</Label>
                                <Input value={RegistrationStartDate} onChange={setRegistrationStartDate} type="date" required />
                            </div>
                            <div>
                                <Label required>Registration End</Label>
                                <Input value={RegistrationEndDate} onChange={setRegistrationEndDate} type="date" required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label required>Event Start Date</Label>
                                <Input value={EventStartDate} onChange={setEventStartDate} type="date" required />
                            </div>
                            <div>
                                <Label>Event End Date <span className="text-white/20 normal-case font-normal tracking-normal">(optional)</span></Label>
                                <Input value={EventEndDate} onChange={setEventEndDate} type="date" />
                            </div>
                        </div>
                    </div>

                    {/* ── Section: Logistics ── */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-lime-400/15 border border-lime-400/25 flex items-center justify-center text-sm">📍</div>
                            <h2 className="font-bold text-sm uppercase tracking-widest text-white/60">Logistics</h2>
                        </div>

                        <div>
                            <Label required>Mode</Label>
                            <SegmentControl
                                value={Mode}
                                onChange={value => setMode(value as "Online" | "Offline" | "Hybrid")}
                                options={[
                                    { label: "Offline", value: "Offline", icon: "🏟️" },
                                    { label: "Online", value: "Online", icon: "💻" },
                                    { label: "Hybrid", value: "Hybrid", icon: "🌐" },
                                ]}
                            />
                        </div>

                        {(Mode === "Offline" || Mode === "Hybrid") && (
                            <div>
                                <Label>Location <span className="text-white/20 normal-case font-normal tracking-normal">(optional)</span></Label>
                                <Input value={Location} onChange={setLocation} placeholder="e.g. Jawaharlal Nehru Stadium, Delhi" />
                            </div>
                        )}

                        <div className="max-w-xs">
                            <Label required>Registration Fee (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">₹</span>
                                <input
                                    type="number"
                                    value={Fee}
                                    onChange={e => setFee(e.target.value)}
                                    placeholder="0 for free"
                                    min={0}
                                    required
                                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-lime-400/50 focus:bg-lime-400/5 transition-all duration-200"
                                />
                            </div>
                            {Fee === "0" || Fee === "" ? null : (
                                <p className="text-white/30 text-xs mt-1.5">Athletes will see this as a paid contest</p>
                            )}
                            {Fee === "0" && (
                                <p className="text-lime-400/60 text-xs mt-1.5 flex items-center gap-1">
                                    <span>✓</span> Free contest — no registration fee
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <div className="flex gap-3 pb-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 rounded-2xl font-bold text-black bg-lime-400 hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                "Publish Contest →"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTitle("");
                                setDescription("");
                                setRegistrationUrl("");
                                setOfficialWebsite("");
                                setRegistrationStartDate("");
                                setRegistrationEndDate("");
                                setSportCategory("");
                                setParticipationType("Solo");
                                setEventStartDate("");
                                setEventEndDate("");
                                setLocation("");
                                setMode("Offline");
                                setFee("");
                                setTeamSize("");
                            }}
                            className="px-6 py-4 rounded-2xl font-bold text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all text-sm"
                        >
                            Reset
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}