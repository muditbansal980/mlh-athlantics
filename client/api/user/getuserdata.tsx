import { BACKEND_URL } from "@/config/app";

export async function fetchUserData() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/userdata/`, {
            credentials: "include",
        });
        if(res.status === 401) {
            return { error: "Unauthorized. Please log in." };
        }
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        return data.User; // an object containing user data
    } catch (err) {
        console.error("Error fetching user data:", (err as Error).message);
        return ({ error: `Could not load user data. Please try again.Error: ${(err as Error).message}` });
    }
}