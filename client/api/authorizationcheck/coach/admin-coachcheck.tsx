import { BACKEND_URL } from "@/config/app";
export async function AdminCoachAuthorizationCheck(coachId: string) {
    const res = await fetch(`${BACKEND_URL}/api/coaches/authorizationcheck/${coachId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        return{
            allowed:false
        }
    }
    if(res.ok){
        return {
            allowed:true
        }
    }    
}