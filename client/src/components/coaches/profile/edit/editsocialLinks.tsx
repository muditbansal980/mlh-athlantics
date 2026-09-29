"use client"
import { BACKEND_URL } from "@/config/app"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCoachProfile } from "../../../../../api/coaches/fetchcoachprofile";
import ErrorPopup from "@/components/lib/errorpopup";
import { AdminCoachAuthorizationCheck } from "../../../../../api/authorizationcheck/coach/admin-coachcheck";
import { useRouter } from "next/navigation";
import PageHeader from "../../../utils/ui/pageheader";
import StatCard from "../../../utils/ui/statcard";
import SocialLinkCard from "../../../utils/coaches/socialLink/socialLink";
type SocialLink = {
    Id: string;
    CoachId: string;
    Platform: string;
    Url: string;
    Tag?: string; // New optional property for the tag
}
type User = {
    Id: string
    Username: string
    Role: string
}

type AddSocialLinkProps = {
    AddWindowDisplay: string;
    // Username: string;
    coachId: string;
    onClose?: () => void; // Optional callback for closing the window
}
export function AddSocialLink({ AddWindowDisplay, coachId, onClose }: AddSocialLinkProps) {
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");
    const [tag, setTag] = useState(""); // New state for the tag
    function handleAddSocialLink() {
        fetch(`${BACKEND_URL}/api/coaches/profile/update/add/socialLinks/${coachId}/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ platform, url, tag })
        })
            .then(response => response.json())
            .then(data => {
                alert(`Social link added successfully`);
            })
            .catch(error => {
                console.error("Error adding social link:", error);
                alert("Failed to add social link");
            });
    }
    return (
        <div className={`${AddWindowDisplay} fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm`}>
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Add Social Link</h2>

                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700" htmlFor="platform">Platform:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setPlatform(e.target.value)} type="text" id="platform" name="platform" required />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="url">URL:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setUrl(e.target.value)} type="text" id="url" name="url" required />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="tag">Tag(Optional):</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setTag(e.target.value)} type="text" id="tag" name="tag" />
                </div>
                <div className="flex">
                    <button className="rounded-xl bg-red-700 px-4 py-2 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200" onClick={handleAddSocialLink}>
                        Add
                    </button>
                    <button className="ml-4 rounded-xl bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export function EditSocialLink({ EditWindowDisplay,onClose, coachId, socialLink }: { EditWindowDisplay: string, onClose: () => void, coachId: string, socialLink: SocialLink | null }) {
    const [platform, setPlatform] = useState(socialLink?.Platform || "");
    const [url, setUrl] = useState(socialLink?.Url || "");
    const [tag, setTag] = useState(socialLink?.Tag || ""); // New state for the tag
    async function handleEditSocialLink() {
        if (!socialLink) {
            console.error("No social link selected for editing.");
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/edit/socialLinks/${coachId}?socialLinkId=${socialLink.Id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ platform, url, tag })
            });
            if (response.ok) {
                alert("Social link updated successfully");
            } else {
                const errorData = await response.json();
                console.error("Error updating social link:", errorData);
                alert(`Failed to update social link: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating social link:", error);
            alert("Failed to update social link");
        }
    }
    // console.log("Edit Window Display:", EditWindowDisplay);
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ${EditWindowDisplay}`}>
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Edit Social Link</h2>
                <div>
                    <label htmlFor="platform">Platform:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setPlatform(e.target.value)} type="text" id="platform" name="platform" value={platform} />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="url">URL:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setUrl(e.target.value)} type="text" id="url" name="url" value={url} />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="tag">Tag(Optional):</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setTag(e.target.value)} type="text" id="tag" name="tag" value={tag} />
                </div>
                <div className="flex mt-6">
                    <button onClick={handleEditSocialLink} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default function SocialLinks() {
    const [userData, setUserData] = useState<User | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null);
    const [editWindow, setEditWindow] = useState(false);
    const [addWindow, setAddWindow] = useState<boolean>(false);
    const params = useParams();
    const coachId = params.coachId as string
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const router = useRouter()
    //fetching the social links of the user
    useEffect(() => {
        async function fetchProfileData() {
            try {
                const profileData = await fetchCoachProfile(coachId)
                setSocialLinks(profileData.socialLinks || []);
                setUserData(profileData.user);
                // console.log("Fetched profile data:", profileData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setErrmsg(`Error fetching profile data:${error}`);
                setErrdisplay("fixed");
            }
        }
        fetchProfileData();
    }, []);

    // timer 
    useEffect(() => {
        if (errdisplay === "fixed") {
            const timer = setTimeout(() => {
                setErrdisplay("hidden");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errdisplay]);

    useEffect(() => {
        // console.log("AUthorization check")
        if (userData) {
            async function AuthorizationCheck() {
                const check = await AdminCoachAuthorizationCheck(coachId)
                if (check?.allowed != true) { router.push("/home") }
            }
            AuthorizationCheck()
        }
    }, [userData])
    // console.log("Social Links:", socialLinks);
    // console.log("editWindow:", editWindow);
    return (
        <div className="min-h-screen bg-slate-50">
            <ErrorPopup message={errmsg} display={errdisplay} />

            {addWindow && (
                <AddSocialLink
                    AddWindowDisplay="fixed"
                    coachId={coachId}
                    onClose={() => setAddWindow(false)}
                />
            )}
            {editWindow && (
                <EditSocialLink
                    EditWindowDisplay="fixed"
                    coachId={coachId}
                    socialLink={selectedLink}
                    onClose={() => setEditWindow(false)}
                />
            )}

            <div className="mx-auto max-w-7xl px-6 py-10">

                <PageHeader
                    title="Coach Social Links"
                    description="Manage all social media profiles displayed on the coach's public profile."
                    buttonText="Add Social Link"
                    onButtonClick={() => setAddWindow(true)}
                />

                <div className="mt-8 mb-8 max-w-xs">
                    <StatCard
                        title="Total Social Links"
                        value={socialLinks.length}
                    />
                </div>

                {socialLinks.length === 0 ? (

                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">

                        <h3 className="text-xl font-semibold text-gray-700">
                            No Social Links
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Add social media accounts to improve the coach's profile.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {socialLinks.map((link) => (

                            <SocialLinkCard
                                key={link.Id}
                                socialLink={link}
                                onEdit={(selected) => {
                                    setSelectedLink(selected);
                                    setEditWindow(true);
                                }}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}