"use client"
import { BACKEND_URL } from "@/config/app";
import { fetchCoachProfile } from "../../../../../api/coaches/fetchcoachprofile";
import { useState, useEffect, useRef } from "react";
import ErrorPopup from "@/components/lib/errorpopup";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import PageHeader from "../../../utils/ui/pageheader";
import { ImagePlus } from "lucide-react";
import { AdminCoachAuthorizationCheck } from "../../../../../api/authorizationcheck/coach/admin-coachcheck";
type User = {
  Id: string
  Username: string
  Role: string
}
export async function UpdateBannerApi(id: string, file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("bannerUrl", file);
//   // console.log("Updating banner :",file.name, "for coachId:", id);
  const res = await fetch(`${BACKEND_URL}/api/coaches/profile/update/banner/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update banner");
  }
  try {
    const data = await res.json();
    // alert(`Banner updated successfully! New URL: ${data?.BannerUrl ?? data?.bannerUrl ?? "not provided"}`);
    return data?.BannerUrl ?? data?.bannerUrl ?? null;
  } catch (error) {
    console.error("Error updating banner:", error);
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
  const coachId = params.coachId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const profileData = await fetchCoachProfile(coachId);
        // BannerUrl always comes back populated thanks to the @default on
        // the column, so this is mainly a safety net while loading.
        setBannerUrl(profileData.profile?.BannerUrl || null);
        setUserData(profileData.user);
      } catch (error) {
        console.error("Error fetching coach profile data:", error);
        setErrmsg(`Error fetching coach profile data:${error}`);
        setErrdisplay("fixed");
      }
    }
    fetchProfileData();
  }, [coachId]);

  useEffect(() => {
    if (!userData?.Id) return;
    async function AuthorizationCheck() {
      const check = await AdminCoachAuthorizationCheck(coachId)
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
  }, [errdisplay,errmsg]);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file later
    if (!file) return;

    // Validate file types client-side (accept can be bypassed)
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrmsg("Invalid file type. Only PNG, JPEG or WEBP are allowed.");
      setErrdisplay("fixed");
      return;
    }

    const previousBannerUrl = bannerUrl;
    const localPreviewUrl = URL.createObjectURL(file);
    setBannerUrl(localPreviewUrl); // optimistic preview while it uploads

    setIsUploading(true);
    try {
        // console.log("Updating banner for coachId:", coachId);
      const savedUrl = await UpdateBannerApi(coachId, file);
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

        <div className="mx-auto max-w-7xl px-6 py-10">

            <PageHeader
                title="Coach Banner"
                description="Update the banner displayed on the coach's public profile."
            />

            <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-300"
                >

                    {bannerUrl ? (
                        <img
                            src={bannerUrl}
                            alt="Banner"
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-72 w-full items-center justify-center bg-gray-100">
                            <div className="text-center text-gray-400">
                                <ImagePlus size={60} className="mx-auto" />
                                <p className="mt-3">No Banner Uploaded</p>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/40">

                        <div className="translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                            <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg">

                                <Camera size={20} className="text-red-700" />

                                <span className="font-medium text-gray-900">
                                    Change Banner
                                </span>

                            </div>

                        </div>

                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                            <div className="rounded-xl bg-white px-8 py-4 shadow-lg">
                                Uploading...
                            </div>

                        </div>
                    )}

                </div>

                <div className="mt-8 flex flex-col gap-3 text-sm text-gray-500">

                    <span>
                        Recommended size: <span className="font-semibold text-gray-800">1920 × 600 px</span>
                    </span>

                    <span>
                        Supported formats: PNG, JPG, WEBP
                    </span>

                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileSelected}
                />

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="rounded-xl bg-red-700 px-6 py-3 font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
                    >
                        {isUploading ? "Uploading..." : "Change Banner"}
                    </button>
                </div>

            </div>

        </div>

    </div>
);
}
