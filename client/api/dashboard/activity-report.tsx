import { BACKEND_URL } from "@/config/app";

export async function fetchActivityReport(activityId: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/api/dashboard/dashboard/player/report/${activityId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (res.status === 401) {
            return { error: "Unauthorized. Please log in.", status: 401 };
        }

        if (res.status === 404) {
            return {
                error: "Report is not ready yet.",
                status: 404,
                report: null,
            };
        }

        if (!res.ok) {
            throw new Error("Failed to fetch activity report");
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch activity report");
    }
}