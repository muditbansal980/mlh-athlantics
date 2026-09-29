"use client"
import { useEffect, useState } from "react"
import { fetchallorgs } from "../../../../api/admin/organizations/getallorganizations"
import { useRouter } from "next/navigation"
import { useUserData } from "../../../../store/usesUserData"
import { fetchUserData } from "../../../../api/user/getuserdata"
import { BACKEND_URL } from "@/config/app"

export default function getallorgs() {
    const [allorgs, setallorgs] = useState([])
    const [role, setrole] = useState<string>("")
    const [loading, setloading] = useState(true)
    const { currentUser } = useUserData();
    const router = useRouter();

    useEffect(() => {
        if (currentUser && currentUser.Role !== "ADMIN") {
            setrole(currentUser.Role);
            router.push("/home");
            return;
        }
        if (currentUser && currentUser.Role === "ADMIN") {
            setrole(currentUser.Role);
            setloading(false);
            return;
        }
        if (!currentUser) {
            fetchUserData()
                .then((res) => {
                    if (res && !res.error) {
                        if (res.Role !== "ADMIN") {
                            setrole(res.Role);
                            router.push("/home");
                            return;
                        } else {
                            setrole(res.Role);
                            setloading(false);
                        }
                    } else {
                        alert("Could not fetch user data. Please login again.");
                        router.push("/login");
                        return;
                    }
                })
                .catch((err) => {
                    console.error("Error fetching user data:", (err as Error).message);
                    alert("Error fetching user data. Please login again.");
                    router.push("/login");
                    return;
                })
        }
        fetchallorgs()
            .then((data) => {
                if (data.status === 403) {
                    router.push("/home");
                    return;
                }
                setallorgs(data)
                setloading(false)
            })
            .catch((err) => {
                console.error("Error fetching organizations:", (err as Error).message);
                setloading(false)
            })
    }, [currentUser])
    async function deleteOrg(id: string, appliedBy: string) {
        const res = await fetch(`${BACKEND_URL}/api/admin/org/delete/${id}?appliedBy=${appliedBy}`, {
            method: "DELETE",
            credentials: "include"
        });
        const result = await res.json();
        alert(result.message);
        setallorgs(allorgs.filter((org: any) => org.Id !== id));
    }

    if (role !== "ADMIN" && role !== "") {
        return (
            <div className="min-h-dvh bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 px-10 py-8 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <p className="text-slate-700 font-medium">Access denied</p>
                    <p className="text-slate-400 text-sm mt-1">Redirecting you to home...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-dvh bg-slate-50 font-sans">

            {/* Top bar */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-slate-800 font-semibold text-base leading-tight">Organizations</h1>
                        <p className="text-slate-400 text-xs">Admin Panel</p>
                    </div>
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100">
                    ADMIN
                </span>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-8 py-8">

                {/* Stats bar */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-slate-700 font-semibold text-lg">All Registrations</h2>
                        <p className="text-slate-400 text-sm mt-0.5">Review and manage organization requests</p>
                    </div>
                    {!loading && role === "ADMIN" && (
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-sm">
                            <p className="text-2xl font-bold text-indigo-600">{allorgs.length}</p>
                            <p className="text-slate-400 text-xs">Total orgs</p>
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-36 bg-slate-100 rounded" />
                                        <div className="h-2 w-24 bg-slate-100 rounded" />
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                                <div className="h-2 w-2/3 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Org cards */}
                {!loading && role === "ADMIN" && (
                    allorgs.length > 0 ? (
                        <div className="space-y-3">
                            {allorgs.map((org: any, idx: number) => (
                                <div
                                    key={org.Id}
                                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                                <span className="text-indigo-600 font-bold text-sm">
                                                    {org.OrganizationName?.charAt(0)?.toUpperCase() || "O"}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-slate-800 font-semibold text-sm truncate">
                                                        {org.OrganizationName}
                                                    </h3>
                                                    <span className="text-slate-300 text-xs shrink-0">#{idx + 1}</span>
                                                </div>

                                                {org.Description && (
                                                    <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                                                        {org.Description}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-3">
                                                    {org.Website && (
                                                        <a
                                                            href={org.Website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                            {org.Website.replace(/^https?:\/\//, '')}
                                                        </a>
                                                    )}
                                                    {org.Email && (
                                                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                            {org.Email}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <button onClick={() => deleteOrg(org.Id, org.AppliedBy)}>Delete</button>                                                </div>
                                            </div>
                                        </div>

                                        {/* Status badge */}
                                        <span className="bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-full border border-amber-100 shrink-0">
                                            Pending
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                            </div>
                            <p className="text-slate-600 font-medium">No organizations yet</p>
                            <p className="text-slate-400 text-sm mt-1">Registrations will appear here once submitted.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}