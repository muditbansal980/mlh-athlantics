"use client"
import { fetchAllCoaches } from "../../../../api/coaches/fetchall";
import { BACKEND_URL } from "@/config/app";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Logout } from "../../../../api/logout/logout";
export async function DeleteCoach(coachId: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/coaches/delete/${coachId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to delete coach");
        }

        const data = await response.json();
        const logoutResponse = await Logout();
        return data;
    } catch (error) {
        console.error("Error deleting coach:", error);
        throw error;
    }
}
export default function CoachesPage() {
    const router = useRouter();
    const [coachesData, setCoachesData] = useState<any[]>([]);
   
    // console.log("Fetched coaches data:", coachesData);
    useEffect(()=>{
        async function fetchCoaches(){
            try {
                const data = await fetchAllCoaches();
                setCoachesData(data);
            } catch (error) {
                console.error("Error fetching coaches data:", error);
            }
        }
        fetchCoaches();
    }, [])

    if (!coachesData) {
        return (
            <div>
                <h1>All Coaches</h1>
                <p>Error fetching coaches data.</p>
            </div>
        );
    }

    return (
        <div>
            <h1>All Coaches</h1>
            {coachesData.length === 0 ? (
                <p>No coaches found.</p>
            ) : (
                <ul>
                    {coachesData.map((coach: any) => (
                        <li key={coach.Id}>
                            {coach.CoachName}
                            <p>{coach.Description}</p>
                            <p>{new Date(coach.CreatedAt).toLocaleString()}</p>
                            <p>{coach.Email}</p>
                            <p onClick={() => router.push(`/profile/coach/${coach.Id}`)}>View Profile</p>
                            <button onClick={() => DeleteCoach(coach.Id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}   
