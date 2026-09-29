"use client";

import { useState, useEffect } from "react";
import Navbar from "@/layouts/Navbar";
import { useParams, useRouter } from "next/navigation";
import { fetchContestById } from "../../../../../../api/contests/getcontestbyid";
import ErrorPopup from "@/components/lib/errorpopup";
import { adminOrgCheck } from "../../../../../../api/authorizationcheck/adminorgcheck";
import { BACKEND_URL } from "@/config/app";
import {
  Edit2,
  Trash2,
  Save,
  X,
  Settings,
  Lock,
  FileText,
  AlertCircle,
  Loader2
} from "lucide-react";

// Explicit type reflecting your exact database prisma/kysely definition schema
export type Contest = {
  Id: string;
  Title: string;
  Description: string;
  RegistrationStartDate: string;
  RegistrationEndDate: string;
  EventStartDate: string;
  EventEndDate?: string | null;
  Website?: string | null;
  Mode: "Online" | "Offline";
  Location?: string | null;
  Fee: number;
  Category?: string | null;
  ParticipationType: "Individual" | "Team";
  TeamSize?: number | null;
  Status: "UPCOMING" | "LIVE" | "COMPLETED";
};

export default function ContestOrganizerDashboard() {
  const [contest, setContest] = useState<Contest | null>(null);
  const [initialContest, setInitialContest] = useState<Contest | null>(null); // Reference point to compare modifications
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Error display states
  const [errmsg, setErrmsg] = useState<string>("");
  const [errdisplay, setErrdisplay] = useState("hidden");
  const [pageError, setPageError] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    const checkAdminOrg = async () => {
      const data = await adminOrgCheck();
      if (!data.isAdminOrg) {
        router.push("/home"); // Redirect to home if not admin/org
      }
    };
    checkAdminOrg();
  }, []);

  // Track field state mutations cleanly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContest((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Safe datetime presentation transformer
  const toLocalInputFormat = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  // Pure Database Initialization Flow (No Mock Data fallback)
  const loadContestData = async () => {
    if (!id) return;
    setIsLoading(true);
    setPageError(null);
    try {
      const data = await fetchContestById(id);
      if (data && !data.error) {
        setContest(data);
        setInitialContest(data);
      } else {
        setPageError(data?.error || "The requested contest profile context could not be located.");
      }
    } catch (err) {
      setPageError("Failed to communicate with DB management services.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContestData();
  }, [id]);

  // ── DELTA DIFFERENCE COMPILER (Sends ONLY altered fields) ──────────────────
  const handleSaveChanges = async () => {
    if (!id || !contest || !initialContest) return;
    setIsSaving(true);

    try {
      const deltaPayload: Record<string, any> = {};

      // Dynamic key verification tracker
      const fieldsToTrack: (keyof Contest)[] = [
        "Title", "Description", "Website", "Mode", "Location", "Status",
        "RegistrationStartDate", "RegistrationEndDate", "EventStartDate", "EventEndDate"
      ];

      fieldsToTrack.forEach((field) => {
        let currentVal = contest[field];
        let initialVal = initialContest[field];

        // Format dates evenly to evaluate changes truthfully
        if (["RegistrationStartDate", "RegistrationEndDate", "EventStartDate", "EventEndDate"].includes(field)) {
          currentVal = currentVal ? new Date(currentVal).toISOString() : null;
          initialVal = initialVal ? new Date(initialVal as string).toISOString() : null;
        }

        // Normalize text links
        if (field === "Website" || field === "Location") {
          currentVal = currentVal || null;
          initialVal = initialVal || null;
        }

        // If the value changed, append it to the delta package
        if (currentVal !== initialVal) {
          deltaPayload[field] = currentVal;
        }
      });

      // Guard check: Stop network call if user didn't change anything
      if (Object.keys(deltaPayload).length === 0) {
        setIsEditing(false);
        alert("No configuration alterations detected.");
        setIsSaving(false);
        return;
      }
      // console.log("Sending data to backend for update")
      const response = await fetch(`${BACKEND_URL}/api/contest/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(deltaPayload)
      });

      const responseData = await response.json();

      // STRICT VALIDATION STEP: Catch failed requests before executing the success block
      if (!response.ok) {
        throw new Error(responseData.message || `Server rejected request with status code ${response.status}`);
      }

      // Sync master reference state with the newly updated modifications
      setInitialContest(JSON.parse(JSON.stringify(contest)));
      setIsEditing(false);
      alert("Contest parameters updated successfully!");

    } catch (err) {
      console.error("Dashboard update transaction failed:", err);
      setErrmsg((err as Error).message || "An unexpected network execution block occurred.");
      setErrdisplay("fixed");
    } finally {
      setIsSaving(false);
    }
  };

  if (errdisplay === "fixed") {
    setTimeout(() => {
      setErrdisplay("hidden");
    }, 5000);
  }

  // ── CONDITIONAL RENDER WORKSPACES (Loading & Fatal Error views) ───────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-zinc-500 tracking-wide">Syncing Workspace Environment...</p>
      </div>
    );
  }

  if (pageError || !contest) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* <Navbar /> */} 
        <main className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="bg-white border-2 border-zinc-200 rounded-2xl p-8 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Data Retrieval Fault</h2>
            <p className="text-sm text-zinc-500 mt-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100 font-mono">
              {pageError || "Resource context resolution failure."}
            </p>
            <button
              onClick={() => router.push("/your-contests")}
              className="mt-6 w-full text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 hover:bg-zinc-800 py-3 rounded-xl transition-all"
            >
              Return to Contests Registry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans">
      <ErrorPopup message={errmsg} display={errdisplay} />
      {/* <Navbar /> */}

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Dashboard Section Top Banner */}
        <div className="bg-white border-b-4 border-red-600 rounded-xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 px-2.5 py-1 bg-red-50 rounded-md">
              Management Workspace
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mt-2">
              {contest.Title || "Untitled Contest"}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review parameters, coordinate structures, or update status tracking settings.
            </p>
          </div>

          {/* Action Trigger Block */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Edit2 size={13} />
                  Edit Settings
                </button>
                <button
                  onClick={() => alert("Delete routine pipeline connection placeholder.")}
                  className="p-2 border border-zinc-200 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Contest"
                >
                  <Trash2 size={15} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={13} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    if (initialContest) setContest(JSON.parse(JSON.stringify(initialContest)));
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  className="p-2 border border-zinc-200 text-zinc-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                  title="Cancel Edit Mode"
                >
                  <X size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Configuration Layout Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                <FileText size={14} className="text-red-600" />
                Primary Content Modules
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Contest Title</label>
                  <input
                    type="text"
                    name="Title"
                    value={contest.Title || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm font-semibold px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Description Brief</label>
                  <textarea
                    name="Description"
                    value={contest.Description || ""}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Official Website Link</label>
                  <input
                    type="url"
                    name="Website"
                    value={contest.Website || ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                <Settings size={14} className="text-red-600" />
                Operational Event Timeline Configurations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Registration Start Date</label>
                  <input
                    type="datetime-local"
                    name="RegistrationStartDate"
                    value={toLocalInputFormat(contest.RegistrationStartDate)}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Registration End Date</label>
                  <input
                    type="datetime-local"
                    name="RegistrationEndDate"
                    value={toLocalInputFormat(contest.RegistrationEndDate)}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Event Competition Start</label>
                  <input
                    type="datetime-local"
                    name="EventStartDate"
                    value={toLocalInputFormat(contest.EventStartDate)}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Event Competition End</label>
                  <input
                    type="datetime-local"
                    name="EventEndDate"
                    value={toLocalInputFormat(contest.EventEndDate)}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Operational Logistics
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Execution Arena Mode</label>
                  <select
                    name="Mode"
                    value={contest.Mode || "Online"}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  >
                    <option value="Online">Online Network Container</option>
                    <option value="Offline">Offline Stadium On-Site Arena</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Physical Location Address</label>
                  <input
                    type="text"
                    name="Location"
                    value={contest.Location || ""}
                    onChange={handleInputChange}
                    placeholder="No physical venue assigned"
                    disabled={!isEditing || contest.Mode === "Online" || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1">Lifecycle Tracking Status</label>
                  <select
                    name="Status"
                    value={contest.Status || "UPCOMING"}
                    onChange={handleInputChange}
                    disabled={!isEditing || isSaving}
                    className="w-full text-sm px-3 py-2 border border-zinc-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 disabled:bg-gray-50 disabled:text-zinc-600"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE / IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                <Lock size={11} className="text-zinc-400" />
                Immutable System Parameters
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-400">Sports Category</label>
                <p className="text-sm font-semibold text-zinc-700 bg-gray-50 border border-zinc-100 px-3 py-1.5 rounded-lg mt-1">
                  {contest.Category || "General Athletics"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400">Participation Layout Matrix</label>
                <p className="text-sm font-semibold text-zinc-700 bg-gray-50 border border-zinc-100 px-3 py-1.5 rounded-lg mt-1">
                  {contest.ParticipationType || "Individual"} {contest.TeamSize ? `(Max ${contest.TeamSize} members)` : ""}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400">Entry Ticket Pricing Structure</label>
                <p className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg mt-1">
                  {contest.Fee === 0 ? "Free Complementary Access" : `INR ${contest.Fee}.00`}
                </p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}