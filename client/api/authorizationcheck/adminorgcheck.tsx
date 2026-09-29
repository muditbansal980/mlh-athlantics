import { BACKEND_URL } from "@/config/app";
export async function adminOrgCheck(){
    try{
        const response = await fetch(`${BACKEND_URL}/api/auth/check-admin-org`, {
            method: "GET",
            credentials: "include", // Include cookies for authentication
        });
        if (response.ok) {
            const data = await response.json();
            return data; // backend returns { isAdminOrg: boolean }
        }
        else if (response.status === 401) {
            console.warn("User is not authenticated");
            return { isAdminOrg: false };
        }
        else if (response.status === 403) {
            console.warn("User is authenticated but not authorized as admin/org");
            return { isAdminOrg: false };
        }
        else {
            console.error("Failed to check admin/org status:", response.statusText);
            return { isAdminOrg: false };
        }
    } catch (error) {
        console.error("Error checking admin/org status:", error);
        return { isAdminOrg: false };
    }
}