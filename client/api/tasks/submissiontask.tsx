import { BACKEND_URL } from "@/config/app";

// Function to submit a task for review by sending the description to backend and updating the task status to "Submitted"
export async function submitTaskforReview(Description: string, taskId: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/tasks/submitTask/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ Description }) // sending the description in the request body
        });
        if (res.ok) {
            // console.log("Task submitted for review successfully");
            return { success: true, message: "Task submitted for review successfully" };
        }
        else if (res.status === 404) {
            // console.log("Task not found with task ID:", taskId);
            return { success: false, message: "Task not found" };
        }
        if (!res.ok) throw new Error("Failed to submit task for review");
    } catch (err) {
        // console.error("Error submitting task for review:", (err as Error).message);
        return { success: false, message: `Could not submit task for review. Please try again. Error: ${(err as Error).message}` };
    }
}