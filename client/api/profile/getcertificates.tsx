import { BACKEND_URL } from "@/config/app";
export async function getcertificates(username: string) {
    // console.log("Fetching certificates for user:", username);
    const res = await fetch(`${BACKEND_URL}/api/profile/certificates/${username}`, {
        credentials: "include",
    });
    if (res.status === 401) {
        console.warn("Unauthorized access when fetching certificates.");
        return { error: "Unauthorized. Please log in." };
    }
    if (res.status === 403) {
        console.warn("Forbidden access when fetching certificates.");
        return { error: "Forbidden. You can only access your own certificates." };
    }
    if(res.status === 404){
        console.warn("No certificates found for the user.");
        return { error: "No certificates found for the user.",status:404 };
    }
    if (!res.ok) {
        console.error("Failed to fetch certificates. Status:", res.status);
        throw new Error("Failed to fetch certificates");
    }
    const data = await res.json();
    return data.certificates;     // backend is returning an array
}   