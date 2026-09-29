"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchCoachProfile } from "../../../../../api/coaches/fetchcoachprofile";
import { useState, useEffect } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import PageHeader from "../../../utils/ui/pageheader";
import { AdminCoachAuthorizationCheck } from "../../../../../api/authorizationcheck/coach/admin-coachcheck";
type User = {
  Id: string
  Username: string
  Role: string
}
export default function Location() {

  const [Location, setLocation] = useState("No Location available.");
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
        setLocation(profileData.profile?.Location || "No Location available.");
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
      const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/Location/${coachId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Location }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Location");
      }

      const data = await response.json();
      setLocation("")
    } catch (error) {
      console.error("Error updating Location:", error);
      setErrmsg(`Error updating Location:${error}`);
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
          title="Coach Location"
          description="Update the coach's location displayed on the public profile."
        />

        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <label className="mb-3 block text-lg font-semibold text-gray-900">
            Location
          </label>

          <input
            type="text"
            value={Location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Delhi, India"
            className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-gray-700 outline-none transition duration-300 focus:border-red-700 focus:ring-4 focus:ring-red-100"
          />

          <p className="mt-3 text-sm text-gray-500">
            This location will be visible on the coach's public profile.
          </p>

          <div className="mt-8 flex justify-end gap-4">


            <button
              onClick={handleUpdateDescription}
              className="rounded-xl bg-red-700 px-6 py-3 font-medium text-white transition duration-300 hover:bg-red-800 hover:shadow-lg"
            >
              Save Location
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
