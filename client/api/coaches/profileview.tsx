import { BACKEND_URL } from "@/config/app";

export async function updateCoachView(coachId: string, view: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/coaches/profile/update/view/${coachId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ view }),
        });

        if (!response.ok) {
            throw new Error("Failed to update coach profile view");
        }

        const data = await response.json();
        // console.log(data.message);
    } catch (error) {
        console.error(error);
    }
}