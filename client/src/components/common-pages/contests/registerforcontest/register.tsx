"use client";

import { useState } from "react";
import Navbar from "@/layouts/Navbar";
import { useParams } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    ArrowRight
} from "lucide-react";

import { BACKEND_URL } from "@/config/app";
export default function UserRegisterPage() {
    // Controlled inputs matching your exact user profile request
    const [formData, setFormData] = useState({
        Name: "",
        Mobile: "",
        Email: "",
        City: "",
        Profession: "STUDENT"
    });
    const params = useParams();

    const ContestId = params.id;


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${BACKEND_URL}/api/contest/register/${ContestId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for authentication
            body: JSON.stringify({
                Name: formData.Name,
                Email: formData.Email,
                PhoneNumber: formData.Mobile,
                Location: formData.City,
                Profession: formData.Profession
            }),
        });
        const data = await res.json();
        if (res.ok) {
            alert("Registration successful!");
        } else {
            alert(`Registration failed: ${data.message}`);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 text-zinc-900 font-sans">
            {/* <Navbar /> */}

            {/* Main Presentation Container */}
            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">

                {/* Banner Section Branding Block */}
                <div className="bg-white border-b-4 border-red-600 rounded-xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 px-2.5 py-1 bg-red-50 rounded-md">
                            Account Onboarding
                        </span>
                        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mt-2">
                            Create User Profile
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Provide your core identity parameters to register within the organization management environment.
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl self-start sm:self-auto">
                        <User className="w-6 h-6 text-red-600" />
                    </div>
                </div>

                {/* Configuration Core Submission Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-6">

                    {/* Main Content Layout Grid: Stacked flex column on mobile, 3-column layout on medium screens and up */}
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6">

                        {/* Column A & B Content Wrapper (Spans 2 columns on desktop) */}
                        <div className="flex flex-col gap-6 md:col-span-2">

                            {/* Box 1: Primary Personal Identifiers */}
                            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                                    <User size={14} className="text-red-600" />
                                    Primary Personal Identity
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">Full Legal Name</label>
                                        <div className="relative">
                                            <User className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                                            <input
                                                type="text"
                                                name="Name"
                                                required
                                                value={formData.Name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full text-sm font-semibold px-3 py-2 pl-9 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 placeholder:text-zinc-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Nested Grid: Stacked on mobile, 2 columns on small screens and up */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 mb-1">Email Address Pointer</label>
                                            <div className="relative">
                                                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                                                <input
                                                    type="email"
                                                    name="Email"
                                                    required
                                                    value={formData.Email}
                                                    onChange={handleInputChange}
                                                    placeholder="name@example.com"
                                                    className="w-full text-sm px-3 py-2 pl-9 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 placeholder:text-zinc-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 mb-1">Mobile Contact Number</label>
                                            <div className="relative">
                                                <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                                                <input
                                                    type="tel"
                                                    name="Mobile"
                                                    required
                                                    value={formData.Mobile}
                                                    onChange={handleInputChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="w-full text-sm px-3 py-2 pl-9 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 placeholder:text-zinc-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Box 2: Geographic Parameters */}
                            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-red-600" />
                                    Geographic Location Logistics
                                </h2>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">Current Residential City</label>
                                    <div className="relative">
                                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                                        <input
                                            type="text"
                                            name="City"
                                            required
                                            value={formData.City}
                                            onChange={handleInputChange}
                                            placeholder="e.g. New Delhi"
                                            className="w-full text-sm px-3 py-2 pl-9 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 placeholder:text-zinc-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column C Workspace (Spans 1 column on desktop) */}
                        <div className="flex flex-col gap-6">

                            {/* Box 3: Classification Arena Selector */}
                            <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 h-full">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                                    <Briefcase size={14} className="text-red-600" />
                                    Workplace Metrics
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">Profession Matrix</label>
                                        <select
                                            name="Profession"
                                            value={formData.Profession}
                                            onChange={handleInputChange}
                                            className="w-full text-sm px-3 py-2 border border-zinc-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-800 font-semibold"
                                        >
                                            <option value="STUDENT">Student / Undergraduate</option>
                                            <option value="ATHLETE">Professional Athlete</option>
                                            <option value="COACH_INSTRUCTOR">Coach / Sports Instructor</option>
                                            <option value="WORKING_PROFESSIONAL">Corporate Working Professional</option>
                                            <option value="OTHER">Other Enterprise Domain</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Full Width Action Frame Control Module (Positioned explicitly out of the grid layout container) */}
                    <div className="w-full pt-2">
                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                        >
                            Execute Registration Setup
                            <ArrowRight size={13} />
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}