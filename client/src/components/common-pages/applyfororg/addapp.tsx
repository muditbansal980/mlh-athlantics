"use client"
import { BACKEND_URL } from "@/config/app";
import { useState, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";

export default function addapp() {
    const [orgName, setOrgName] = useState("");
    const [username, setUsername] = useState("");
    const [orgDescription, setOrgDescription] = useState("");
    const [orgWebsite, setOrgWebsite] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [orgProof, setOrgProof] = useState("");
    const [loading, setLoading] = useState(false);
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const orgProofRef = useRef<HTMLInputElement>(null);

    async function handleSubmit() {
        const file = orgProofRef.current?.files?.[0]
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
        formData.append("OrganizationName", orgName);
        formData.append("Username", username);
        formData.append("OrganizationDescription", orgDescription);
        formData.append("OrganizationWebsite", orgWebsite);
        formData.append("Email", orgEmail);
        // formData.append("Password", password);
        if (orgProofRef.current?.files?.[0]) {
            formData.append("OrganizationProof", orgProofRef.current.files[0]);
        }
        const res = await fetch(`${BACKEND_URL}/api/orgs/apply`, {
            method: "POST",
            // headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: formData
        });
        setLoading(false);
        const data = await res.json();
        // console.log("Response from server:", data);
        if (res.ok) {
            alert("Application submitted successfully!");
            setOrgName("");
            setUsername("");
            setOrgDescription("");
            setOrgWebsite("");
            setOrgEmail("");
            // setPassword("");
        }
        else if (res.status === 400) {
            const errors = JSON.parse(data.errors.message);
            setErrmsg(errors[0].message || "Validation failed. Please check your input.");
            setErrdisplay("fixed");
        }
        else {
            const errors = JSON.parse(data.errors.message);
            // setErrmsg(errors[0].message);
            setErrmsg(errors[0].message || "Failed to submit application.");
            setErrdisplay("fixed");
        }
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-slate-800 text-2xl font-bold">Apply as Organization</h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in your details to submit a registration request</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

                    {/* Section: Organization Info */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Organization Info</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Organization Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Acme Corp"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                                <textarea
                                    placeholder="What does your organization do?"
                                    value={orgDescription}
                                    onChange={(e) => setOrgDescription(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Website</label>
                                    <input
                                        type="text"
                                        placeholder="https://acme.com"
                                        value={orgWebsite}
                                        onChange={(e) => setOrgWebsite(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="org@acme.com"
                                        value={orgEmail}
                                        onChange={(e) => setOrgEmail(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Section: Account */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Account Details</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
                                <input
                                    type="text"
                                    placeholder="acme_official"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                Organization Proof
                                <span className="ml-1 text-slate-300 font-normal">(link or reference)</span>
                            </label>
                            <input
                                type="file"
                                accept=".jpeg,.png"
                                ref={orgProofRef}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
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