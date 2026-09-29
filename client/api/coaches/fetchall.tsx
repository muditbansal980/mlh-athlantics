import { BACKEND_URL } from "@/config/app";
export async function fetchAllCoaches() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/coaches/fetchall`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch coaches");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return { error: "Failed to fetch coaches" };
  }
}