"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchProfile } from "../../../../api/profile/fetchprofile";
import { useState, useEffect, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PageHeader from "../../utils/ui/pageheader";
import { AdminOwnerauthorizationcheck } from "../../../../api/authorizationcheck/admin-ownercheck";

type Profile = {
  Id: string
  Bio?: string
  About?: string
  AvatarUrl?: string
  BannerUrl?: string
  SocialLinks?: string[]
  Location?: string
  CreatedAt: Date
  UpdatedAt?: Date
}

type User = {
  Id: string
  Username: string
  Role: string
}

export async function UpdateAvatarApi(username: string, file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("avatarUrl", file);

  const res = await fetch(`${BACKEND_URL}/api/profile/update/avatar/${username}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update avatar");
  }

  try {
    const data = await res.json();
    return data?.AvatarUrl ?? data?.avatarUrl ?? null;
  } catch {
    return null;
  }
}

export default function Avatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [errmsg, setErrmsg] = useState("");
  const [errdisplay, setErrdisplay] = useState<"hidden" | "fixed">("hidden");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchProfile(username);
        setAvatarUrl(profileData.profile?.AvatarUrl || null);
        // console.log("Profile data:", profileData);
        setUserData(profileData.user);
      } catch (error) {
        // console.error("Error fetching profile data:", error);
        setErrmsg(`Error fetching profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, [username]);
  // console.log("Avatar url :", avatarUrl)
  useEffect(() => {
    if (!userData?.Id) return;
    async function AuthorizationCheck() {
      const check = await AdminOwnerauthorizationcheck(userData!.Id);
      if (check?.allowed !== true) {
        router.push("/home");
      }
    }
    AuthorizationCheck();
  }, [userData]);

  useEffect(() => {
    if (errdisplay !== "fixed") return;
    const timer = setTimeout(() => setErrdisplay("hidden"), 5000);
    return () => clearTimeout(timer);
  }, [errdisplay]);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file later
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrmsg("Invalid file type. Only PNG, JPEG or WEBP are allowed.");
      setErrdisplay("fixed");
      return;
    }
    const previousAvatarUrl = avatarUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    setAvatarUrl(localPreviewUrl); // optimistic preview while it uploads

    setIsUploading(true);
    try {
      // console.log("Uploading avatar for user:", username);
      const savedUrl = await UpdateAvatarApi(username, file);
      setAvatarUrl(savedUrl ?? localPreviewUrl);
      if (savedUrl) URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      // console.error("Error updating avatar:", error);
      setErrmsg(`Error updating avatar:${error}`);
      setErrdisplay("fixed");
      setAvatarUrl(previousAvatarUrl); // revert the optimistic preview
      URL.revokeObjectURL(localPreviewUrl);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ErrorPopup message={errmsg} display={errdisplay} />

      <div className="mx-auto max-w-7xl px-6 py-10">

        <PageHeader
          title="Profile Avatar"
          description="Upload a professional profile picture that represents you across the platform."
        />

        <div className="mt-8 max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Profile Picture
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            JPG, PNG and WebP images are supported. A square image works best.
          </p>

          <div className="mt-8 flex flex-col items-center gap-6">

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-44 w-44 rounded-full border-4 border-red-100 object-cover shadow-lg transition hover:scale-105"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-100 text-gray-400">
                No Image
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={handleFileSelected}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Choose New Avatar"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Your avatar is visible to other users throughout Athlantic.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
