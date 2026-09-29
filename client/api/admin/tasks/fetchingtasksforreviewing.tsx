import { BACKEND_URL } from "@/config/app";
export async function fetchTasksForReviewing() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/admin/tasks/getTasksForReviewing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
        });
        if (res.ok) {
            const data = await res.json();
            // console.log("Tasks for reviewing fetched from backend:", data.TasksForReviewing);
            return data.TasksForReviewing; // an array of tasks that are in "Submitted" status and need to be reviewed by admin
        }
        if (!res.ok) throw new Error("Failed to fetch tasks for reviewing");
    } catch (err) {
        // console.error("Error fetching tasks for reviewing:", (err as Error).message);
        return ({ error: `Could not load tasks for reviewing. Please try again. Error: ${(err as Error).message}` });
    }
}