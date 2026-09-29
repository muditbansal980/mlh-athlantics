import { BACKEND_URL } from "@/config/app";
export async function updateUserRole(userId:string,Role:string,AccessibleRoles:string[]) {
    try{
        const response = await fetch(`${BACKEND_URL}/api/userdata/updateRole`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify({userId,Role,AccessibleRoles})
        });
        if(!response.ok){
            return {error:`Failed to update user role: ${response.status} ${response.statusText}`};
        }
        const data = await response.json();
        // console.log("User role updated successfully:", data);
        return data;
    }catch(error){
        console.error("Error updating user role:",error);
        throw error;
    }
}