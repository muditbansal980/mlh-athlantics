"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchCoachProfile } from "../../../../../api/coaches/fetchcoachprofile";
import { useState, useEffect } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import PageHeader from "../../../utils/ui/pageheader";

// import { AdminOwnerauthorizationcheck } from "../../../../../api/authorizationcheck/admin-ownercheck";
import { AdminCoachAuthorizationCheck } from "../../../../../api/authorizationcheck/coach/admin-coachcheck";
type User = {
  Id: string
  Username: string
  Role: string
}
export default function Description() {

  const [Description, setDescription] = useState("No Description available.");
  const [userData, setUserData] = useState<User | null>(null);
  const [errmsg, setErrmsg] = useState("");
  const router = useRouter()
  const [errdisplay, setErrdisplay] = useState("hidden");
  const params = useParams();
  const coachId = params.coachId as string;
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchCoachProfile(coachId)
        setDescription(profileData.profile?.Description || "No Description available.");
        setUserData(profileData.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrmsg(`Error fetching profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, []);
  // authorization check
  useEffect(() => {
    // console.log("AUthorization check")
    async function AuthorizationCheck() {
      if (userData) {

        const check = await AdminCoachAuthorizationCheck(coachId)
        // console.log("Authorization check result:", check?.allowed);
        if (check?.allowed != true) { router.push("/home") }
      }
    }
    AuthorizationCheck()
  }, [userData])

  async function handleUpdateDescription() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/Description/${coachId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Description");
      }

      const data = await response.json();
      setDescription("")
    } catch (error) {
      console.error("Error updating Description:", error);
      setErrmsg(`Error updating Description:${error}`);
      setErrdisplay("fixed");
    }
  }
  if (errdisplay === "fixed") {
    setTimeout(() => {
      setErrdisplay("hidden");
    }, 5000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ErrorPopup message={errmsg} display={errdisplay} />

      <div className="mx-auto max-w-6xl px-6 py-10">

        <PageHeader
          title="Coach Description"
          description="Update the description displayed on the coach's public profile."
        />

        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <div>

            <label className="mb-3 block text-lg font-semibold text-gray-900">
              Description
            </label>

            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              maxLength={500}
              placeholder="Write a professional description about the coach..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-5 py-4 text-gray-700 outline-none transition duration-300 focus:border-red-700 focus:ring-4 focus:ring-red-100"
            />

            <div className="mt-3 flex justify-between text-sm text-gray-500">

              <span>
                This will appear on the coach's public profile.
              </span>

              <span>
                {Description.length}/500
              </span>

            </div>

            <div className="mt-8 flex justify-end gap-4">

              <button
                className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateDescription}
                className={`rounded-xl px-6 py-3 font-medium transition ${Description.trim()==="" ?"cursor-not-allowed bg-gray-300 text-gray-500":"bg-red-700 text-white hover:bg-red-800 hover:shadow-lg"}`}
                disabled={Description.trim() === ""}
              >
                Save Description
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
