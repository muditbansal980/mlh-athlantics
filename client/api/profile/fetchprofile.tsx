import { BACKEND_URL } from "@/config/app";

export async function fetchProfile(username: string) {
    const profile = await fetch(`${BACKEND_URL}/api/profile/${username}`,{
        method:"GET",
        credentials:"include",
    })
    const data = await profile.json();
    if(profile.ok){
        return data;
    }
    if(profile.status === 404){
        return {error: data.message };
    }
    if(profile.status === 500){
        return {error: "Internal Server Error"};
    }
    throw new Error("Failed to fetch profile");
}