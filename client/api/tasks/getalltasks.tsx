import { BACKEND_URL } from "@/config/app";
export async function fetchalltasks(){
    const res = await fetch(`${BACKEND_URL}/api/tasks/getAllTasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
    });
    const data = await res.json();
    return data;
}