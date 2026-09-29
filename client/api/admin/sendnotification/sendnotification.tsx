import { BACKEND_URL } from "@/config/app";
export async function sendNotification(receiverId: string, title: string, message: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/notifications/sendNotification/${receiverId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: title,
                Message: message
            })
        });
        return await response.json();
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}