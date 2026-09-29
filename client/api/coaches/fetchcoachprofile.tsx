import { BACKEND_URL } from "@/config/app";
import { error } from "console";
export async function fetchCoachProfile(coachId: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/coaches/fetchcoachprofile/${coachId}`,{
        credentials: "include",
    });
    if (!response.ok) {
      return {error: `Failed to fetch coach data`};
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coach data:", error);
    throw error;
  }
}