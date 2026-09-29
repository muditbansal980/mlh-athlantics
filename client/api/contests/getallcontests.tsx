import { BACKEND_URL } from "@/config/app";

export async function fetchallContests() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/contest/getall`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch contests");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching contests:", (err as Error).message);
        return ({ error: `Could not load contests. Please try again.Error: ${(err as Error).message}` });
    }
};
