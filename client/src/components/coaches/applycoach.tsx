"use client"
import { useState, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import Applycoach from "../../../api/coaches/apply";
export default function applycoach() {
    const [coachName, setCoachName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const coachProofRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState("");
    async function handleSubmit() {
        const file = coachProofRef.current?.files?.[0]
        if (file) {
            const validTypes = ["image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)) {
                setErrmsg("Invalid file type. Please upload a JPEG or PNG image.");
                setErrdisplay("fixed");
                return;
            }
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("CoachName", coachName);
        formData.append("Email", email);
        formData.append("Description", description);
        if (coachProofRef.current?.files?.[0]) {
            formData.append("VerificationDoc", coachProofRef.current.files[0]);
        }
        const res = await Applycoach(formData)
        .then((data) => {
            if (data.error) {
                setErrmsg(data.error);
                setErrdisplay("fixed");
            }
            setLoading(false);
            alert("Application submitted successfully!");
            setCoachName("");
            setEmail("");
            setDescription("");
        })
        .catch((error) => {
            setErrmsg("An error occurred while submitting the application.");
            setErrdisplay("fixed");
            setLoading(false);
        });
    }
    if (errdisplay === "fixed") {
        setTimeout(() => {
            setErrdisplay("hidden");
        }, 5000);
    }
    return (
        <div className="min-h-dvh bg-slate-50 flex items-center justify-center px-4 py-12">
            <ErrorPopup display={errdisplay} message={errmsg} />
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z" />
                        </svg>
                    </div>
                    <h1 className="text-slate-800 text-2xl font-bold">Apply as Coach</h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in your details to submit a coaching application</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                    <div className="border-t border-slate-100" />

                    {/* Section: Account */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Account Details</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="your good name"
                                    value={coachName}
                                    onChange={(e) => setCoachName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                                <input
                                    type="text"
                                    placeholder="Enter additional info about you and if any other proofs you want to submit than you could submit their links make sure to provide valid links and access to them"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Section: Proof */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Verification</p>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Coaching Certificate / ID
                                <span className="ml-1 text-slate-300 font-normal">(image)</span>
                            </label>
                            <input
                                type="file"
                                accept=".jpeg,.png"
                                ref={coachProofRef}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            "Submit Application"
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Your application will be reviewed by an admin before approval.
                </p>
            </div>
        </div>
    );
}
