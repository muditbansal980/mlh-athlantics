import { BACKEND_URL } from "@/config/app";
export async function fetchallorgs() {
    const res = await fetch(`${BACKEND_URL}/api/admin/org/getAllOrgs`, {
        method: "GET",
        credentials: "include"
    })
    if(res.status === 403){
        return {status:403, success: false, message: "Access denied. Redirecting to home." };
    }
    const orgs = await res.json()
    return orgs.Organizations
}