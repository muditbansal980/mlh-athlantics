import { BACKEND_URL } from "@/config/app";
export async function fetchallusers() {
    // setLoading(true);
    // setError(null);
    try {
        const res = await fetch(`${BACKEND_URL}/api/admin/users/all`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        //   setUsers(data.Users ?? []);
        return data.Users ?? [];
    } catch (err: unknown) {
        // console.log("Error", err instanceof Error ? err.message : err);
         console.error("Error", err instanceof Error ? err.message : err);
        // setError(
        //     err instanceof Error ? err.message : "Failed to fetch users."
        // );
    }
};