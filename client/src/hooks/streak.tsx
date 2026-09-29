"use client";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/config/app";

async function fetchStreak(){
    try{
        // console.log("Fetching streak data from backend...");
        const res = await fetch(`${BACKEND_URL}/api/activity/streak`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        if(res.status === 404){
            console.warn("Streak data not found for the user.");
            return { Streak: "No streak found for user" }; // Return null or an appropriate default value
        }
        if(res.status === 401) {
            console.warn("Unauthorized access when fetching streak data.");
            return { error: "Unauthorized. Please log in." };
        }
        if(!res.ok){
            console.error("Failed to fetch streak data. Status:", res.status);
            throw new Error("Failed to fetch streak data");
        }
        const data = await res.json();
        // console.log("Fetched streak data:", data);
        return data;
    }
    catch(error){
        console.error("Error fetching streak:", error);
        throw error;
    }
}
export function useStreak(){
    return useQuery({
        queryKey: ["streak"],
        queryFn: fetchStreak,
    })
    
}
