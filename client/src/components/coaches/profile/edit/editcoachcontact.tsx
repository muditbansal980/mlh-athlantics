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
import ContactCard from "../../../utils/coaches/contact/contactcard";
type Contact = {
    Id: string;
    CoachId: string;
    Label: string;
    Value: string;
}
type User = {
    Id: string
    Username: string
    Role: string
}

type AddContactProps = {
    AddWindowDisplay: string;
    // Username: string;
    coachId: string;
    onClose?: () => void; // Optional callback for closing the window
}
export function AddContact({ AddWindowDisplay, coachId, onClose }: AddContactProps) {
    const [label, setLabel] = useState("");
    const [value, setValue] = useState("");
    
    function handleAddSocialLink() {
        fetch(`${BACKEND_URL}/api/coaches/profile/update/add/contact/${coachId}/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ label,value })
        })
            .then(response => response.json())
            .then(data => {
                alert(`Contact added successfully`);
            })
            .catch(error => {
                console.error("Error adding Contact:", error);
                alert("Failed to add Contact");
            });
    }
    return (
        <div className={`${AddWindowDisplay} fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm`}>
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Add Contact</h2>

                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700" htmlFor="label">Label:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setLabel(e.target.value)} type="text" id="label" name="label" required />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="value">Value:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setValue(e.target.value)} type="text" id="value" name="value" required />
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

export function EditContact({ EditWindowDisplay, onClose, coachId, contact }: { EditWindowDisplay: string, onClose: () => void, coachId: string, contact:Contact | null }) {
    const [label, setLabel] = useState(contact?.Label || "");
    const [value, setValue] = useState(contact?.Value || "");
    async function handleEditSocialLink() {
        if (!contact) {
            console.error("No Contact selected for editing.");
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/edit/contact/${coachId}?contactId=${contact?.Id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ label, value })
            });
            if (response.ok) {
                alert("Contact updated successfully");
            } else {
                const errorData = await response.json();
                console.error("Error updating Contact:", errorData);
                alert(`Failed to update Contact: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error updating Contact:", error);
            alert("Failed to update Contact");
        }
    }
    // console.log("Edit Window Display:", EditWindowDisplay);
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ${EditWindowDisplay}`}>
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Edit Contact</h2>
                <div>
                    <label htmlFor="label">Label:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setLabel(e.target.value)} type="text" id="label" name="label" value={label} />
                </div>
                <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700" htmlFor="value">Value:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setValue(e.target.value)} type="text" id="value" name="value" value={value} />
                </div>
                <div className="flex mt-6">
                    <button onClick={handleEditSocialLink} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default function Contacts() {
    const [userData, setUserData] = useState<User | null>(null);
    const [contacts, setContact] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
                setContact(profileData.contacts || []);
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
                <AddContact
                    AddWindowDisplay="fixed"
                    coachId={coachId}
                    onClose={() => setAddWindow(false)}
                />
            )}
            {editWindow && (
                <EditContact
                    EditWindowDisplay="fixed"
                    coachId={coachId}
                    contact={selectedContact}
                    onClose={() => setEditWindow(false)}
                />
            )}

            <div className="mx-auto max-w-7xl px-6 py-10">

                <PageHeader
                    title="Coach Contacts"
                    description="Manage all contact information displayed on the coach's public profile."
                    buttonText="Add Contact"
                    onButtonClick={() => setAddWindow(true)}
                />

                <div className="mt-8 mb-8 max-w-xs">
                    <StatCard
                        title="Total Contacts"
                        value={contacts.length}
                    />
                </div>

                {contacts.length === 0 ? (

                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">

                        <h3 className="text-xl font-semibold text-gray-700">
                            No Contacts
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Add contact information to improve the coach's profile.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {contacts.map((contact) => (

                            <ContactCard
                                key={contact.Id}
                                contact={contact}
                                onEdit={(selected) => {
                                    setSelectedContact(selected);
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