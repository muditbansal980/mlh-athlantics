import { BACKEND_URL } from "@/config/app";
export async function ApproveCoachApplication(coachId: string, userId: string) {
    // console.log("Approving coach application for coachId:", coachId, "and userId:", userId);
    const response = await fetch(`${BACKEND_URL}/api/admin/coaches/approve/${coachId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });
    return response.json();
}
export async function RejectCoachApplication(coachId: string, userId: string) {
    // console.log("Rejecting coach application for coachId:", coachId, "and userId:", userId);
    const response = await fetch(`${BACKEND_URL}/api/admin/coaches/reject/${coachId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });
    return response.json();
}