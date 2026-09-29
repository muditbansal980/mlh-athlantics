import { BACKEND_URL } from "@/config/app";

export async function Logout() {
    try {
     localStorage.clear();
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      if (response.ok) {
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: "Failed to log out. Please try again." };
    }
  }