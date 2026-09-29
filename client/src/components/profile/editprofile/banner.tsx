"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchProfile } from "../../../../api/profile/fetchprofile";
import { useState, useEffect, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/utils/ui/pageheader";
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

// ---------------------------------------------------------------------------
// Standalone API call. It only touches its own arguments — no component
// state, no refs, no hooks — so this can be cut-and-pasted into its own
// file later (e.g. api/profile/updatebanner.ts) with no changes needed.
// ---------------------------------------------------------------------------
export async function UpdateBannerApi(username: string, file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("bannerUrl", file);

  const res = await fetch(`${BACKEND_URL}/api/profile/update/banner/${username}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update banner");
  }

  // Backend may or may not hand back the saved Cloudinary URL — handle both.
  try {
    const data = await res.json();
    return data?.BannerUrl ?? data?.bannerUrl ?? null;
  } catch {
    return null;
  }
}

export default function Banner() {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
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
        // BannerUrl always comes back populated thanks to the @default on
        // the column, so this is mainly a safety net while loading.
        setBannerUrl(profileData.profile?.BannerUrl || null);
        setUserData(profileData.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrmsg(`Error fetching profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, [username]);

  // authorization check — skipped until real profile data has loaded,
  // otherwise it'd run once with an empty userData.Id and bounce you
  // to /home before the real check ever happens.
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

    const previousBannerUrl = bannerUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    setBannerUrl(localPreviewUrl); // optimistic preview while it uploads

    setIsUploading(true);
    try {
      const savedUrl = await UpdateBannerApi(username, file);
      setBannerUrl(savedUrl ?? localPreviewUrl);
      if (savedUrl) URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error("Error updating banner:", error);
      setErrmsg(`Error updating banner:${error}`);
      setErrdisplay("fixed");
      setBannerUrl(previousBannerUrl); // revert the optimistic preview
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
          title="Profile Banner"
          description="Upload a high-quality banner that represents your profile."
        />

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Banner Image
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Recommended size: <span className="font-medium">1500 × 500 px</span>.
              JPG, PNG and WEBP images are supported.
            </p>
          </div>

          <div
            className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-slate-100 transition hover:border-red-600"
          >

            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Banner"
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center">
                <div className="text-center">

                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
                    🖼️
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700">
                    No Banner Uploaded
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Upload a banner to personalize your profile.
                  </p>

                </div>
              </div>
            )}

          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleFileSelected}
          />

          <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div>

              <h4 className="font-semibold text-gray-800">
                Banner Visibility
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Your banner is visible on your public profile.
              </p>

            </div>

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-red-700 px-6 py-3 font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Choose New Banner"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
