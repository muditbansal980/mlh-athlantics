import { BACKEND_URL } from "@/config/app"
export async function getcontestsbyparticularorg() {
    const res = await fetch(`${BACKEND_URL}/api/orgs/getcontestsbyparticularorg`, {
        credentials: "include",
    });
    if (res.status === 401) {
        console.warn("Unauthorized access when fetching contests for the organization.");
        return { error: "Unauthorized. Please log in." };
    }
    if (res.status === 403) {
        console.warn("Forbidden access when fetching contests for the organization.");
        return { error: "Forbidden. You can only access contests organized by your organization." };
    }
    if(res.status === 404){
        console.warn("No contests found for your organization.");
        return { error: "No contests found for your organization.",status:404 };
    }
    if (!res.ok) {
        console.error("Failed to fetch contests for the organization. Status:", res.status);
        throw new Error("Failed to fetch contests for the organization");
    }
    const data = await res.json();
    return data.contests;   
}