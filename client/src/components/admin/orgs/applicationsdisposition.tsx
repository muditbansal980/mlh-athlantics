"use client"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/config/app"
import {
    Building2, RefreshCw, CheckCircle, XCircle,
    AlertCircle, Loader2, Globe, Mail, FileText, Clock,
} from "lucide-react"

interface Application {
    Id: string
    AppliedBy:string
    OrganizationName: string
    Description: string
    Website: string
    Email: string
    VerificationDoc: string
    Status: string
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => { getallapplications() }, [])

    async function getallapplications() {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/org/getOrgApplications`, {
                method: "GET", credentials: "include",
            })
            const apps = await res.json()
            setApplications(apps.Applications ?? [])
        } catch {
            setError("Failed to fetch applications.")
        } finally {
            setLoading(false)
        }
    }

    async function approveapp(id: string, appliedBy: string) {
        setActionLoading(id + "_approve")
        const res = await fetch(`${BACKEND_URL}/api/admin/org/approve/${id}?appliedBy=${appliedBy}`, { method: "PATCH", credentials: "include" })
        const result = await res.json()
        alert(result.message)
        await getallapplications()
        setActionLoading(null)
    }

    async function rejectapp(id: string, appliedBy: string) {
        setActionLoading(id + "_reject")
        await fetch(`${BACKEND_URL}/api/admin/org/reject/${id}?appliedBy=${appliedBy}`, { method: "PATCH", credentials: "include" })
        await getallapplications()
        setActionLoading(null)
    }

    return (
        <div className="min-h-dvh bg-slate-50 font-sans">
            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Org Applications</h1>
                        </div>
                        <p className="text-sm text-slate-400 pl-12">
                            {loading ? "Loading…" : `${applications.length} pending application${applications.length !== 1 ? "s" : ""}`}
                        </p>
                    </div>
                    <button
                        onClick={getallapplications}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        <RefreshCw className={"w-4 h-4 " + (loading ? "animate-spin" : "")} />
                        Refresh
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
                        <p className="text-sm text-slate-400">Fetching applications…</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Could not load applications</p>
                        <p className="text-xs text-slate-400">{error}</p>
                        <button onClick={getallapplications} className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && applications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">No pending applications</p>
                        <p className="text-xs text-slate-400">New applications will appear here</p>
                    </div>
                )}

                {/* Cards */}
                {!loading && !error && applications.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {applications.map((app) => (
                            <div key={app.Id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

                                {/* Card header */}
                                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{app.OrganizationName}</p>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            <Clock className="w-2.5 h-2.5" />
                                            Pending Review
                                        </span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="px-5 py-4 flex-1 space-y-3">
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                        {app.Description || "No description provided."}
                                    </p>
                                    <div className="space-y-1.5">
                                        {app.Website && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                                                <a href={app.Website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition truncate">
                                                    {app.Website}
                                                </a>
                                            </div>
                                        )}
                                        {app.Email && (
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                                <span className="truncate">{app.Email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Verification doc */}
                                    {app.VerificationDoc && (
                                        <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                                            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Verification Doc</span>
                                            </div>
                                            {/* <img src={app.VerificationDoc} alt="Verification Document" className="w-full max-h-44 object-contain p-2" /> */}
                                            <div className="px-3 py-2 border-t border-slate-100">
                                                <img src={app.VerificationDoc} alt="Verification Document" className="w-full max-h-44 object-contain p-2" />
                                                <a
                                                    href={app.VerificationDoc}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                                    <button
                                        onClick={() => approveapp(app.Id,app.AppliedBy)}
                                        disabled={actionLoading !== null}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                                    >
                                        {actionLoading === app.Id + "_approve"
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <CheckCircle className="w-4 h-4" />}
                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => rejectapp(app.Id,app.AppliedBy)}
                                        disabled={actionLoading !== null}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-red-50 disabled:opacity-50 text-red-600 border border-red-200 hover:border-red-300 text-sm font-medium transition-colors"
                                    >
                                        {actionLoading === app.Id + "_reject"
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <XCircle className="w-4 h-4" />}
                                        <span>Reject</span>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}