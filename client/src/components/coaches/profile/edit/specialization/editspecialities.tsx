"use client"
import { BACKEND_URL } from "@/config/app"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCoachProfile } from "../../../../../../api/coaches/fetchcoachprofile";
import ErrorPopup from "@/components/lib/errorpopup";
// import { AdminOwnerauthorizationcheck } from "../../../../../api/authorizationcheck/admin-ownercheck";
import { AdminCoachAuthorizationCheck } from "../../../../../../api/authorizationcheck/coach/admin-coachcheck";
import { useRouter } from "next/navigation";
import PageHeader from "../../../../utils/ui/pageheader";
import StatCard from "../../../../utils/ui/statcard";
import SpecializationCard from "../../../../utils/coaches/specialization/specializationcard";
type Specialization = {
    Id: string;
    Specialization: string;
}
type User = {
    Id: string
    Username: string
    Role: string
}

type AddSpecializationProps = {
    AddWindowDisplay: string;
    onClose?: () => void;
    coachId: string;
}
export function AddSpecialization({ AddWindowDisplay, onClose,coachId }: AddSpecializationProps) {
    const [specialization, setSpecialization] = useState("");
    function handleAddSpecialization() {
        fetch(`${BACKEND_URL}/api/coaches/profile/update/add/specializations/${coachId}/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ specialization })
        })
            .then(response => response.json())
            .then(data => {
                alert(` Specialization added successfully`);
            })
            .catch(error => {
                console.error("Error adding  Specialization:", error);
                alert("Failed to add  Specialization");
            });
    }
    return (
        <div className={`${AddWindowDisplay} fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm`}>
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Add Specialization</h2>

                <div className="mt-6">
                    <label htmlFor="specialization" className="text-sm font-medium text-gray-700">
                        Specialization
                    </label>

                    <input
                        className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200"
                        onChange={(e) => setSpecialization(e.target.value)}
                        type="text"
                        id="specialization"
                        placeholder="Enter your expertise or training domain"
                        required
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className=" text-black rounded-xl border px-5 py-3 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button
                        onClick={handleAddSpecialization}
                        className="rounded-xl bg-red-700 px-5 py-3 text-white transition hover:bg-red-800"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    )
}

export function EditSpecialization({ EditWindowDisplay, onClose,specialization, CoachId }: { EditWindowDisplay: string,onClose: () => void, specialization: Specialization | null, CoachId: string }) {
    const [specializationName, setSpecializationName] = useState(specialization?.Specialization || "");
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");``
    async function handleEditSpecialization() {
        if (!specialization) {
            console.error("No  Specialization selected for editing.");
            return;
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/edit/specializations/${CoachId}?specializationId=${specialization.Id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ specialization: specializationName })
            });
            if (response.ok) {
                alert(" Specialization updated successfully");
            } else {
                const errorData = await response.json();
                console.error("Error updating  Specialization:", errorData);
                setErrmsg(`Failed to update  Specialization: ${errorData.message}`);
                setErrdisplay("fixed");
            }
        } catch (error) {
            console.error("Error updating  Specialization:", error);
            setErrmsg("Failed to update  Specialization");
            setErrdisplay("fixed");
        }
    }
    // console.log("Edit Window Display:", EditWindowDisplay);
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ${EditWindowDisplay}`}>
            <ErrorPopup message={errmsg} display={errdisplay} />
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900">Edit Specialization</h2>
                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700" htmlFor="specialization">Specialization:</label>
                    <input className="mt-2 w-full rounded-xl border  text-black border-gray-300 px-4 py-3 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-200" onChange={(e) => setSpecializationName(e.target.value)} type="text" id="specialization" name="specialization" value={specializationName} required/>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button className="rounded-xl bg-red-700 px-5 py-3 text-white transition hover:bg-red-800" onClick={handleEditSpecialization}>Save</button>
                    <button className="text-black rounded-xl border px-5 py-3 hover:bg-gray-100" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}
export default function Specializations() {
    const [userData, setUserData] = useState<User | null>(null);
    const [specializations, setspecializations] = useState<Specialization[]>([]);
    const [selectedspecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
    const [editWindow, setEditWindow] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const [addWindow, setAddWindow] = useState<boolean>(false);
    const params = useParams();
    const coachId = params.coachId as string
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const router = useRouter()
    //fetching the  specialization of the user
    useEffect(() => {
        async function fetchProfileData() {
            try {
                if (!coachId) return;
                const profileData = await fetchCoachProfile(coachId)
                setspecializations(profileData.specializations || []);
                setUserData(profileData.user);
                // console.log("Fetched profile data:", profileData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setErrmsg(`Error fetching profile data:${error}`);
                setErrdisplay("fixed");
            }
        }
        fetchProfileData();
    }, [coachId]);

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
        // console.log("Authorization check")
        if (userData) {
            async function AuthorizationCheck() {
                const check = await AdminCoachAuthorizationCheck(coachId)
                if (check?.allowed != true) {
                    // console.log(check)
                    setAllowed(false);
                    // console.log("Not authorized to access this page");
                    router.push("/home")
                } else {
                    // console.log("check for allowed:", check)
                    setAllowed(true);
                }
            }
            AuthorizationCheck()
        }
        else {
            return;
        }
    }, [userData])
    return (
        <div className="min-h-screen bg-slate-50 mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title="Coach Specializations"
                description="Manage the coach's expertise and training domains."
                buttonText="Add Specialization"
                onButtonClick={() => setAddWindow(true)}
            />
            <ErrorPopup message={errmsg} display={errdisplay} />
            <div className="mb-8 max-w-xs">
                <StatCard title="Total Specializations" value={specializations.length} />
            </div>
            {
                addWindow && <AddSpecialization onClose={() => setAddWindow(false)} AddWindowDisplay={addWindow ? "fixed" : "hidden"} coachId={coachId} />
            }
            <EditSpecialization
                CoachId={coachId}
                EditWindowDisplay={editWindow ? "fixed" : "hidden"}
                specialization={selectedspecialization}
                onClose={() => setEditWindow(false)}
            />
            {/* {specializations.length === 0 ? (
                <p>No  specializations available.</p>
            ) : (
                specializations.map((Specialization: Specialization) => (
                    <div key={Specialization.Id}>
                        <h3>Specialization:-{Specialization.Specialization}</h3>
                        <div>
                            <Edit3 size={14} onClick={() => { setEditWindow(true); setSelectedSpecialization(Specialization) }} />
                        </div>
                    </div>
                )))} */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {specializations.map((specialization) => (
                    <SpecializationCard
                        key={specialization.Id}
                        specialization={specialization}
                        onEdit={(selected) => {
                            setSelectedSpecialization(selected);
                            setEditWindow(true);
                        }}
                    />
                ))}
            </div>
        </div>
    )
}