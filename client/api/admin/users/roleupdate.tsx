import { BACKEND_URL } from "@/config/app";
export async function updateUserRole(id: string, role: string) {
    const response = await fetch(`${BACKEND_URL}/api/admin/users/update/role/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ Role: role })
    });
    return response.json();
}