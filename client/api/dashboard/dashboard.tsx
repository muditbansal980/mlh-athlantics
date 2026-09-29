import { BACKEND_URL } from "@/config/app";
export async function fetchdashbaordData(){
    try{
        const res = await fetch(`${BACKEND_URL}/api/dashboard/dashboard/player`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (res.status === 401) {
            return ({ error: "Unauthorized. Please log in." , status: 401 });
        }
        if (!res.ok) {
            throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        return data;
    }catch (error) {
        console.error(error);
        throw new Error("Failed to fetch dashboard data");
    }
}