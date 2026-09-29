import { BACKEND_URL } from "@/config/app";
export async function AdminOwnerauthorizationcheck(ownerId:string){
    const res = await fetch(`${BACKEND_URL}/api/auth/admin-owner-check/${ownerId}`,{
        credentials:"include"
    })
    if(res.ok){
        return {allowed:true}
    }
    if(res.status === 401){
        return {allowed:false,unauthorized:true}
    }
    if(res.status === 403){
        return {allowed:false,forbidden:true}
    }
    else{
        return {
            allowed:false
        }
    }
}