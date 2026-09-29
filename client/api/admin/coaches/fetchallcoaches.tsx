import {BACKEND_URL} from "@/config/app";
export async function fetchAllCoaches() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/coaches/getAllCoaches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {error:`Failed to fetch coaches data.`};
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {error:`An error occurred while fetching coaches data: ${error}`};
  }
}