"use client"
import { BACKEND_URL } from "@/config/app"
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProfile } from "../../../../api/profile/fetchprofile";
import ErrorPopup from "@/components/lib/errorpopup";
import { AdminOwnerauthorizationcheck } from "../../../../api/authorizationcheck/admin-ownercheck";
import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
type SocialLink = {
    Id: string;
    Platform: string;
    Url: string;
}
type User = {
    Id: string
    Username: string
    Role: string
}

type AddSocialLinkProps = {
    AddWindowDisplay: string;
    Username: string;

}
export function AddSocialLink({ AddWindowDisplay, Username }: AddSocialLinkProps) {
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");
    function handleAddSocialLink() {
        fetch(`${BACKEND_URL}/api/profile/socialLinks/${Username}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ platform, url })
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
        <div className={AddWindowDisplay}>
            <h2>Add Social Link</h2>
            <div>
                <label htmlFor="platform">Platform:</label>
                <input onChange={(e) => setPlatform(e.target.value)} type="text" id="platform" name="platform" />
            </div>
            <div>
                <label htmlFor="url">URL:</label>
                <input onChange={(e) => setUrl(e.target.value)} type="text" id="url" name="url" />
            </div>
            <div className="flex">
                <button onClick={handleAddSocialLink}>Add</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}

export function EditSocialLink({EditWindowDisplay,Username,socialLink}:{EditWindowDisplay:string,Username:string,socialLink:SocialLink|null}) {
    const [platform, setPlatform] = useState(socialLink?.Platform || "");
    const [url, setUrl] = useState(socialLink?.Url || "");
    async function handleEditSocialLink() {
        if (!socialLink) {
            console.error("No social link selected for editing.");
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/profile/update/socialLinks/${Username}/${socialLink.Id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ platform, url })
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
    return(
        <div className={`inset-0 bg-black bg-opacity-50 flex items-center justify-center ${EditWindowDisplay}`}>
            <div className="bg-white p-6 rounded-lg">
                <h2>Edit Social Link</h2>
                <div>
                    <label htmlFor="platform">Platform:</label>
                    <input onChange={(e) => setPlatform(e.target.value)} type="text" id="platform" name="platform" value={platform} />
                </div>
                <div>
                    <label htmlFor="url">URL:</label>
                    <input onChange={(e) => setUrl(e.target.value)} type="text" id="url" name="url" value={url} />
                </div>
                <div className="flex">
                    <button onClick={handleEditSocialLink}>Save</button>
                    <button>Cancel</button>
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
    const username = params.username as string
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const router = useRouter()


    //fetching the social links of the user
    useEffect(() => {
        async function fetchProfileData() {
            try {
                const profileData = await fetchProfile(username)
                setSocialLinks(profileData.profile?.SocialLinks || []);
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
    //request for fetching the social links of the user
    useEffect(() => {
        async function fetchSocialLinks() {
            // console.log("Fetching social links for user:", username);
            const res = await fetch(`${BACKEND_URL}/api/profile/socialLinks/${username}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.ok) {
                const data = await res.json();
                // console.log("Fetched social links:", data.socialLinks);
                setSocialLinks(data.socialLinks);
            } else {
                const errorData = await res.json();
                setErrmsg(`Error fetching social links: ${errorData.message}`);
                setErrdisplay("fixed");
            }
        }
        fetchSocialLinks()
    }, [])

    // timer 
    useEffect(() => {
        if (errdisplay === "fixed") {
            const timer = setTimeout(() => {
                setErrdisplay("hidden");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errdisplay]);

    // authorization check
    // authorization check
    useEffect(() => {
        // console.log("AUthorization check")
        if (userData) {
            async function AuthorizationCheck() {
                const check = await AdminOwnerauthorizationcheck(userData!.Id)
                if (check?.allowed != true) { router.push("/home") }
            }
            AuthorizationCheck()
        }
    }, [userData])
    // console.log("Social Links:", socialLinks);
    return (

        <div>
            <ErrorPopup message={errmsg} display={errdisplay} />

            {
                addWindow && <AddSocialLink AddWindowDisplay={addWindow ? "fixed" : "hidden"} Username={username} />
            }
            {
                editWindow && <EditSocialLink EditWindowDisplay={editWindow ? "fixed" : "hidden"} Username={username} socialLink={selectedLink} />
            }
            {socialLinks.length === 0 ? (
                <p>No social links available.</p>
            ) : (
                socialLinks.map((link) => (
                    <div key={link.Id}>
                        <h3>Platform:-{link.Platform}</h3>
                        <p>Link:-{link.Url}</p>
                        <div>
                            <Edit3 size={14} onClick={()=>{setEditWindow(true);setSelectedLink(link)}}/>
                        </div>
                    </div>

                )))}
            <button onClick={() => setAddWindow(true)} >
                Add Social Link
            </button>
        </div>
    )
}