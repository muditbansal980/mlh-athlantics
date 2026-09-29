import { BACKEND_URL } from "@/config/app";
export async function fetchContestById(id: string) {
      try {
        // Pointing directly to your client-facing public secure API URL
        const res = await fetch(`${BACKEND_URL}/api/contest/${id}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
          credentials: "include", 
        });
        if(res.status === 404){
            return ({ error: "Contest not found. It may have been deleted or the ID is incorrect." });
        }
        if (!res.ok) throw new Error(`Failed to fetch contest with ID ${id}`);
        const data = await res.json();
        return data;
      } catch (err) {
        console.error(`Error fetching contest with ID ${id}:`, (err as Error).message);
        return ({ error: `Could not load contest details. Please try again.Error: ${(err as Error).message}` });
      }
}