import { BACKEND_URL } from "@/config/app";
import { json } from "zod";

export async function createUserInDB(userId: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/tasks/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId
            }),
            credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
            return json({ message: "User created successfully in DB" });
        }
        if (response.status === 409) {
            return json({ message: "User already exists in DB" });
        }
        else {
            throw new Error(data.message || "Failed to create user in DB");
        }

    } catch (error) {
        console.error("Error creating user in DB:", error);
        throw error;
    }
}