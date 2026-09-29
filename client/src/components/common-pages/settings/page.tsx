"use client";

import { useState } from "react";
import Link from "next/link"; // Imported Link for navigation
import { fetchUserData } from "../../../../api/user/getuserdata";
import { useEffect } from "react";
import SportyLoader from "@/components/lib/loading";
import { useUserData } from "../../../../store/usesUserData";
import { updateUserRole } from "../../../../api/user/updateRole/updateRole";
import { useRouter } from "next/navigation";
import {
  Settings,
  Sun,
  Moon,
  AlertTriangle,
  User,
  ChevronRight,
  LogOut,
  Check,
  X,
  Briefcase, // Imported for the Coach section icon
} from "lucide-react";
import { Logout } from "../../../../api/logout/logout";

// types
import { UserData } from "@/types/userdata";

type Theme = "light" | "dark";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [sosEnabled, setSosEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const {currentUser,setcurrentUser} = useUserData();
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setLoggedOut(true);
    handlelogout();
  };

  // Function to handle switching roles
   async function handleSwitchingRole(role: string, userId: string) {
    try {
      const data = await updateUserRole(userId, role, userData?.AccessibleRoles || []);
      if(data.error){
        alert("Error switching role: " +  data.error);
        return;
      }
      // console.log("Role switched successfully:", data);
      setcurrentUser(data.User);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  }
  async function handlelogout() {
    try {
      const result = await Logout();
      if (result?.success) {
        setLoggedOut(true);
        setcurrentUser(null);
      } else {
        alert(result?.error || "Failed to log out. Please try again.");
      }
    } catch (error) {
      alert("Failed to log out. Please try again.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
        // console.log("Fetched user data for settings page:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-dvh bg-[#F8F7F4] font-sans">
      {/* <Navbar /> */}
      {loading && <SportyLoader onComplete={() => setLoading(false)} />}
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Settings className="w-5 h-5 text-stone-400" />
            <h1 className="text-[22px] font-medium text-stone-900 tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-sm text-stone-500 ml-8">
            Manage your preferences and account
          </p>
        </div>

        {/* Appearance Section */}
        {/* <SectionLabel>Appearance</SectionLabel>
        <SectionCard>
          <Row>
            <IconWrap color="blue">
              <Sun className="w-[18px] h-[18px]" />
            </IconWrap>
            <RowText
              title="Theme"
              sub={theme === "light" ? "Currently light mode" : "Currently dark mode"}
            />
            <div className="flex bg-stone-100 rounded-lg p-[3px] gap-[2px]">
              <ThemeButton
                active={theme === "light"}
                onClick={() => setTheme("light")}
                icon={<Sun className="w-[14px] h-[14px]" />}
                label="Light"
              />
              <ThemeButton
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                icon={<Moon className="w-[14px] h-[14px]" />}
                label="Dark"
              />
            </div>
          </Row>
        </SectionCard> */}

        {/* Safety Section */}
        {/* <SectionLabel>Safety</SectionLabel>
        <SectionCard>
          <Row>
            <IconWrap color="amber">
              <AlertTriangle className="w-[18px] h-[18px]" />
            </IconWrap>
            <RowText
              title="Emergency SOS"
              sub="Trigger alert & share location"
            />
            <div className="flex items-center gap-2">
              {sosEnabled && (
                <span className="text-[11px] font-medium px-2 py-[3px] rounded-full bg-red-50 text-red-700">
                  Active
                </span>
              )}
              <Toggle enabled={sosEnabled} onChange={setSosEnabled} />
            </div>
          </Row>
        </SectionCard> */}

        {/* Professional Section */}
        <SectionLabel>Professional</SectionLabel>
        <SectionCard>
          <Link
            href="/coaches/apply"
            className="flex items-center gap-3 px-5 py-4 hover:bg-stone-50/50 transition-colors cursor-pointer group"
          >
            <IconWrap color="stone">
              <Briefcase className="w-[18px] h-[18px]" />
            </IconWrap>
            <RowText
              title="Apply as Coach"
              sub="Join our team and manage your trainees"
            />
            <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-400 transition-colors" />
          </Link>
        </SectionCard>

        {/* Account Section */}
        <SectionLabel>Account</SectionLabel>
        <SectionCard>
          <Row>
            <IconWrap color="stone">
              <User className="w-[18px] h-[18px]" />
            </IconWrap>
            <RowText title="Profile" sub="Manage your account details" />
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </Row>

          <div className="border-t border-stone-100" />

          <button
            onClick={() => !loggedOut && setShowLogoutModal(true)}
            disabled={loggedOut}
            className={`flex w-full items-center gap-3 px-5 py-4 text-[15px] font-medium transition-colors
              ${loggedOut
                ? "text-green-700 cursor-default"
                : "text-red-700 hover:bg-red-50 cursor-pointer"
              }`}
          >
            {loggedOut ? (
              <>
                <Check className="w-5 h-5" />
                Signed out
              </>
            ) : (
              <div>
                <LogOut className="w-5 h-5" />
                Log out
              </div>
            )}
          </button>
        </SectionCard>
      </div>
      {
        userData?.AccessibleRoles && (
          <div className="max-w-xl mx-auto px-6 py-10">
            <SectionLabel>Accessible Roles</SectionLabel>
            <SectionCard>
              {userData.AccessibleRoles.map((role) => (
                <div key={role} className="flex justify-between p-2 items-center">
                  <Row>
                    <RowText title={role} sub={`You have access to the ${role} role`} />
                  </Row>
                  <button onClick={() => handleSwitchingRole(role, userData.Id)} className="bg-blue-400 rounded-xl p-2 h-[20%]">Switch</button>
                </div>
              ))}
            </SectionCard>
          </div>
        )
      }
      <div className="max-w-xl mx-auto px-6 py-10">
            <SectionLabel>Accessible Roles</SectionLabel>
            <SectionCard>
              
                <div  className="flex justify-between p-2 items-center hover:bg-stone-100 cursor-pointer" onClick={()=>router.push("/applyorg")}>
                  <Row>
                    <RowText title = "Apply for Organization" sub="Request to join an organization"  />
                  </Row>
                  {/* <button onClick={() => handleSwitchingRole(role, userData.Id)} className="bg-blue-400 rounded-xl p-2 h-[20%]">Switch</button> */}
                </div>
              
            </SectionCard>
          </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-stone-200/60 p-6 w-full max-w-xs shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[16px] font-medium text-stone-900">Log out?</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors -mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-stone-500 leading-relaxed mb-5">
              You'll be signed out of your account. Any unsaved changes will be
              lost.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-[7px] rounded-lg border border-stone-200 text-[13px] text-stone-500 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-[7px] rounded-lg bg-red-700 text-white text-[13px] font-medium hover:bg-red-800 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-widest uppercase text-stone-400 px-1 mb-1.5 mt-6 first:mt-0">
      {children}
    </p>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200/70 rounded-xl overflow-hidden">
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      {children}
    </div>
  );
}

function RowText({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-medium text-stone-900">{title}</p>
      <p className="text-[13px] text-stone-500 truncate">{sub}</p>
    </div>
  );
}

type IconColor = "blue" | "amber" | "red" | "stone";
const iconColors: Record<IconColor, string> = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  stone: "bg-stone-100 text-stone-500",
};

function IconWrap({
  color,
  children,
}: {
  color: IconColor;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}
    >
      {children}
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] font-medium transition-all
        ${active
          ? "bg-white text-stone-800 shadow-sm"
          : "text-stone-400 hover:text-stone-600"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-[46px] h-[26px] rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1
        ${enabled ? "bg-green-700" : "bg-stone-300"}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
          ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}