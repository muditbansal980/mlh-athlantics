import { BACKEND_URL } from "@/config/app";

export default async function applycoach(formData: FormData) {
    const res = await fetch(`${BACKEND_URL}/api/coaches/apply`, {
        method: "POST",
        credentials: "include",
        body: formData
    });
    const data = await res.json();
    if (!res.ok) {
        return {error : data.message || "Failed to submit application."};
    }
    return data;
}