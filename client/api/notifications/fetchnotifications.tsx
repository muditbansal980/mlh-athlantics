import { BACKEND_URL } from "@/config/app";
import { Notifications } from "@/types/notifications";
export async function fetchNotifications() {
    const response = await fetch(`${BACKEND_URL}/api/notifications/getnotifications`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // Include credentials for authentication
    });
    try{
        if (response.ok){
            const data = await response.json();
            return data.Notifications as Notifications[];
        }
        else{
            return {error: "Failed to fetch notifications"} as any;
        }
    }
    catch (error) {
        // console.error("Error fetching notifications:", error);
        return {error: "Error fetching notifications"} as any;
    }
}