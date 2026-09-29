"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchProfile } from "../../../../api/profile/fetchprofile";
import { useState, useEffect } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import PageHeader from "../../utils/ui/pageheader"
import { AdminOwnerauthorizationcheck } from "../../../../api/authorizationcheck/admin-ownercheck";
type User = {
  Id: string
  Username: string
  Role: string
}
export default function About() {

  const [description, setDescription] = useState("No description available.");
  const [userData, setUserData] = useState<User | null>(null);
  const [errmsg, setErrmsg] = useState("");
  const router = useRouter()
  const [errdisplay, setErrdisplay] = useState("hidden");
  const params = useParams();
  const username = params.username as string;
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchProfile(username)
        setDescription(profileData.profile?.About || "No description available.");
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

        const check = await AdminOwnerauthorizationcheck(userData.Id)
        // console.log("Authorization check result:", check?.allowed);
        if (check?.allowed != true) { router.push("/home") }
      }
    }
    AuthorizationCheck()
  }, [userData])

  async function handleUpdateDescription() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/profile/update/about/${username}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to update description");
      }

      const data = await response.json();
      setDescription("")
    } catch (error) {
      console.error("Error updating description:", error);
      setErrmsg(`Error updating description:${error}`);
      setErrdisplay("fixed");
    }
  }
  if (errdisplay === "fixed") {
    setTimeout(() => {
      setErrdisplay("hidden");
    }, 5000);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 shadow-2xl">
      <ErrorPopup message={errmsg} display={errdisplay} />
      <PageHeader
        title="About Me"
        description="Write a short introduction that visitors will see on your public profile."
        buttonText="Save Changes"
        onButtonClick={handleUpdateDescription}
      />
      <textarea
        rows={8}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-gray-700 outline-none transition focus:border-red-700 focus:ring-4 focus:ring-red-100 resize-none"
      />
      <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800" onClick={handleUpdateDescription}>
        Update Description
      </button>
    </div>
  );
}
