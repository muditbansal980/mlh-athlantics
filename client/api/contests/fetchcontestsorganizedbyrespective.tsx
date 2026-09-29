import { BACKEND_URL } from "@/config/app";

export async function fetchContestsOrganizedByRespective() {
    try{
        const res = await fetch(`${BACKEND_URL}/api/contest/get/organizedbyrespective`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch contests organized by respective");
        const data = await res.json();
        // console.log("Data fetched for contests organized by respective:", data);
        return data;
    }
    catch(err){
        console.error("Error fetching contests organized by respective:", (err as Error).message);
        return ({ error: `Could not load contests organized by respective. Please try again.Error: ${(err as Error).message}` });
    }
};