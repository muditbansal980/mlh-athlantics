"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchCoachProfile } from "../../../../../api/coaches/fetchcoachprofile";
import { useState, useEffect, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import PageHeader from "../../../utils/ui/pageheader";
// import { AdminOwnerauthorizationcheck } from "../../../../../api/authorizationcheck/admin-ownercheck";
import { AdminCoachAuthorizationCheck } from "../../../../../api/authorizationcheck/coach/admin-coachcheck";
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

// ---------------------------------------------------------------------------
// Standalone API call. It only touches its own arguments — no component
// state, no refs, no hooks — so this can be cut-and-pasted into its own
// file later (e.g. api/profile/updateavatar.ts) with no changes needed.
// ---------------------------------------------------------------------------
export async function UpdateAvatarApi(coachId: string, file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("avatarUrl", file);

  const res = await fetch(`${BACKEND_URL}/api/coaches/profile/update/avatar/${coachId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update avatar");
  }

  // Backend may or may not hand back the saved Cloudinary URL — handle both.
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
  const coachId = params.coachId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchCoachProfile(coachId);
        setAvatarUrl(profileData.profile?.AvatarUrl || null);
        setUserData(profileData.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrmsg(`Error fetching profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, [coachId]);
  useEffect(() => {
    if (!userData?.Id) return;
    async function AuthorizationCheck() {
      const check = await AdminCoachAuthorizationCheck(coachId);
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
      const savedUrl = await UpdateAvatarApi(coachId, file);
      setAvatarUrl(savedUrl ?? localPreviewUrl);
      if (savedUrl) URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error("Error updating avatar:", error);
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

      <div className="mx-auto max-w-6xl px-6 py-10">

        <PageHeader
          title="Coach Avatar"
          description="Update the coach's public profile picture."
        />

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                  <Camera className="scale-0 text-white transition-all duration-300 group-hover:scale-100" size={36} />
                </div>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-48 w-48 rounded-full border-4 border-red-700 object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Camera size={48} />
                    <p className="mt-2 text-sm">No Avatar</p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-white">
                      Uploading...
                    </span>
                  </div>
                )}
              </div>
              <h2 className="mt-8 text-2xl font-semibold text-gray-900">
                Coach Profile Picture
              </h2>
              <p className="mt-2 text-center text-gray-500">
                Upload a high quality square image.
                <br />
                PNG, JPG and WEBP are recommended.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileSelected}
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-xl bg-red-700 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-red-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? "Uploading..." : "Change Avatar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
