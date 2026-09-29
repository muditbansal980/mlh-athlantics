"use client";

import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/config/app";
import { useParams } from "next/navigation";
import Navbar from "@/layouts/Navbar";
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase 
} from "lucide-react";

export default function RegisterForContest() {
  const { id } = useParams<{ id: string }>();
  const [registeredUsersData, setRegisteredUsersData] = useState([]);
  
  // console.log("ContestId in getRegistrationsData:", id);

  useEffect(() => {
    async function fetchRegisteredUsersData(ContestId: string) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/contest/registrations/${ContestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error("Failed to fetch registered users data");
        }
        const data = await response.json();
        // console.log("Fetched registered users data:", data);
        setRegisteredUsersData(data);
      } catch (error) {
        console.error("Error fetching registered users data:", error);
      }
    }
    if (id) fetchRegisteredUsersData(id);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans">
      {/* <Navbar /> */}

      {/* Main Presentation Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Banner Section Branding Block */}
        <div className="bg-white border-b-4 border-red-600 rounded-xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 px-2.5 py-1 bg-red-50 rounded-md">
              Administrative Console
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mt-2">
              Registered Users
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Review and audit profiles registered under administrative record identifier context.
            </p>
          </div>
          <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl self-start sm:self-auto">
            <Users className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Data Matrix Table Framework wrapped with responsive horizontal scrolling overflow */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
          <div className="w-full overflow-x-auto min-w-full inline-block align-middle">
            <table className="min-w-full divide-y divide-zinc-100 table-auto text-left">
              <thead>
                <tr className="bg-zinc-50/70 border-b border-zinc-100">
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1.5"><User size={13} className="text-red-600" /> Name</span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-red-600" /> Email</span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-red-600" /> Mobile Contact</span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-red-600" /> City</span>
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1.5"><Briefcase size={13} className="text-red-600" /> Profession</span>
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-zinc-100 bg-white">
                {registeredUsersData.length === 0 ? (
                  <tr key="empty-state-row">
                    <td colSpan={5} className="px-6 py-10 text-center text-xs font-semibold text-zinc-400">
                      No matching account telemetry profiles recorded in this environment context.
                    </td>
                  </tr>
                ) : (
                  registeredUsersData.map((user: any,index: number) => (
                    <tr key={user.id || index} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900">
                        {user.RegistrationData?.Name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-600">
                        {user.RegistrationData?.Email || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-zinc-500 font-mono">
                        {user.RegistrationData?.PhoneNumber || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-600">
                        {user.RegistrationData?.Location || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md border border-zinc-200">
                          {user.RegistrationData?.Profession || "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}