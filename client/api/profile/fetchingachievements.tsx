import {BACKEND_URL} from "../../src/config/app"


export async function fetchAchievements(username:string){
    const res = await fetch(`${BACKEND_URL}/api/profile/achievements/${username}`,{
        "credentials":"include",
        method:"GET"
    })
    try{

        const data = await res.json();
        if(res.ok){
            return (data.achievements)
        }
        if(res.status == 404){
            return ({error:"No acheivements found"})
        }
        if(res.status == 401){
            return ({error:"Unauthenticated,Please Login First",status:401})
        }
    }
    catch(error){
        return {error:error}
    }
}