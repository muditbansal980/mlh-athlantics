import { BACKEND_URL } from "@/config/app";
export async function fetchParticularTaskData(taskId: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/getTask/${taskId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            return data.Task; // an object containing task data
        }
        else if(res.status === 404){
            return ({ error: "Task not found" });
        }
        if (!res.ok) throw new Error("Failed to fetch task data");
    } catch (err) {
        console.error("Error fetching task data:", (err as Error).message);
        return ({ error: `Could not load task data. Please try again.Error: ${(err as Error).message}` });
    }
}