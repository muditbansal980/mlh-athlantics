import { BACKEND_URL } from "@/config/app";
export async function approvalfortask(taskId:string,userId:string) {
    try{
        const res = await fetch(`${BACKEND_URL}/api/admin/tasks/approveTask/${taskId}?userId=${userId}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
        });
        if(res.ok){
            // console.log("Task approved successfully");
            return { success: true, message: "Task approved successfully" };
        }
        else if(res.status === 404){
            // console.log("Task not found with task ID:", taskId);
            return { success: false, message: "Task not found" };
        }
        if(!res.ok) throw new Error("Failed to approve task");  
    }
    catch(err){
        // console.error("Error approving task:", (err as Error).message);
        return { success: false, message: `Could not approve task. Please try again. Error: ${(err as Error).message}` };
    }
}
export async function rejectionfortask(taskId:string) {
    try{
        const res = await fetch(`${BACKEND_URL}/api/admin/tasks/rejectTask/${taskId}`,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
        });
        if(res.ok){
            // console.log("Task rejected successfully");
            return { success: true, message: "Task rejected successfully" };
        }
        else if(res.status === 404){
            // console.log("Task not found with task ID:", taskId);
            return { success: false, message: "Task not found" };
        }
        if(!res.ok) throw new Error("Failed to reject task");  
    }
    catch(err){
        // console.error("Error rejecting task:", (err as Error).message);
        return { success: false, message: `Could not reject task. Please try again. Error: ${(err as Error).message}` };
    }
}
