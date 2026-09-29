// importing data for a particular task of a particular user from the database using userId and taskId as a parameter as a many users can do the same task and we need to fetch data for a particular user
import { BACKEND_URL } from "@/config/app";
export async function fetchParticularTaskDataForUser(taskId: string, userId: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/getUserTaskData/${taskId}?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            // console.log("User-specific task data fetched from backend:", data.UserTaskData);
            return data.UserTaskData; // an object containing task data for the particular user
        }
        else if(res.status === 404){
            // console.log("Task not found for the user with task ID:", taskId, "and user ID:", userId);
            return ({ error: "Task not found for the user" });
        }
        if (!res.ok) throw new Error("Failed to fetch task data for the user");
    } catch (err) {
        // console.error("Error fetching task data for the user:", (err as Error).message);
        return ({ error: `Could not load task data for the user. Please try again.Error: ${(err as Error).message}` });
    }
}