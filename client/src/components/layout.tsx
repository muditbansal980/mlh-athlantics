"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../layouts/Sidebar";

import { SIDEBAR_WIDTH } from "../constants/layouts";
import { useEffect, useState } from "react"
import { fetchUserData } from "../../api/user/getuserdata";
import { useUserData } from "../../store/usesUserData";
import { useRouter } from "next/navigation";
const PUBLIC_ROUTES = ["/", "/register"];




export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const userData = useUserData();
  const { hydrated } = userData;
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  // 1. Check if the route belongs to PUBLIC_ROUTES
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  // 2. Check if the route is a dynamic exercise page (/exercises/anything)
  const isExerciseRoute = pathname.startsWith("/exercises/");

  // 3. Hide the sidebar if it's either public OR an exercise route
  const showSidebar = !isPublicRoute && !isExerciseRoute;
  async function fetchdata() {
    if (role) return;
    if (userData.currentUser?.Role) {
      setRole(userData.currentUser?.Role);
    }
    else {
      // console.log("Fetching user data in dashboard layout")
      fetchUserData().then((data) => {
        if (!data) {
          router.push("/login");
          return;
        }
        if (data.error) {              // safe even if data is an object without "error"
          router.push("/register");
          return;
        }
        setRole(data.Role);
      }).catch((err) => {
        console.error("Failed to fetch user data:", err);
        router.push("/login");
      });
    }
  }
  useEffect(() => {
    if (isPublicRoute) return;
    if (!hydrated) return;
    // console.log("Effect ran — role:", role, "currentUser:", userData.currentUser?.Username);
    fetchdata();
  }, [userData.currentUser?.Role, hydrated])

  if (!showSidebar) {
    return <>{children}</>;
  }
  return (
    <div
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
        } as React.CSSProperties
      }
      className="lg:flex"
    >
      {role !== "" && (
        <>
          <Sidebar role={role} />
          {/* <Navbar /> */}
        </>
      )
      }
      {/* Content */}
      <main className="min-h-dvh flex-1 lg:ml-[var(--sidebar-width)]">
        {children}
      </main>
    </div>
  );
}