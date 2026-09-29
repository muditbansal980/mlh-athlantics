import { BACKEND_URL } from "@/config/app";
import { useRouter } from "next/navigation";
export async function fetchactivitydata(){
    try{
        const response = await fetch(`${BACKEND_URL}/api/activity/activitydata`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.status === 401) {
            return ({ error: "Unauthorized. Please log in." });
        }
        if (!response.ok) {
            throw new Error("Failed to fetch activity data");
        }
        const data = await response.json();
        return data.Activities;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch activity data");
    }
}

export async function updateActivityView(activityId:number,view:string){
    try{
        const response = await fetch(`${BACKEND_URL}/api/activity/updateview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ activityId, view }),
        });
        if (response.status === 401) {
            return ({ error: "Unauthorized. Please log in." });
        }
        if (!response.ok) {
            throw new Error("Failed to update activity view");
        }
        const data = await response.json();
        return data;    
    }catch (error) {
        console.error(error);
        throw new Error("Failed to update activity view");
    }
}