"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";
import { Ellipsis, Globe, Shield, Trash2, Video, Calendar, Edit } from "lucide-react";
import { fetchactivitydata, updateActivityView } from "../../../../api/activity/activity";
import Navbar from "../../../layouts/Navbar";
import Footer from "../../../layouts/Footer";
import { BACKEND_URL } from "@/config/app";
import {useRouter} from "next/navigation";
type Activity = {
    Id: number;
    CreatedAt: string;
    UpdatedAt: string;
    CreatedBy: number;
    UpdatedBy: number;
    VideoUrl: string;
    View: string; // Synced with backend field response
};

// ─── GSAP POWERED EYE STATUS COMPONENT ───
// ─── OPTIMIZED ERROR-FREE GSAP EYE STATUS COMPONENT ───
// ─── OPTIMIZED ERROR-FREE GSAP EYE STATUS COMPONENT ───
function AnimatedEye({ view }: { view: string }) {
    const irisRef = useRef<SVGCircleElement>(null);
    const topLashRef = useRef<SVGPathElement>(null);
    const bottomLashRef = useRef<SVGPathElement>(null);
    const isPublic = view.toUpperCase() === "PUBLIC";

    useEffect(() => {
        if (isPublic) {
            // Animate Eye Open smoothly using clean spatial hardware transforms
            gsap.to(irisRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(topLashRef.current, { y: 0, scaleY: 1, transformOrigin: "center top", duration: 0.3, ease: "power2.out" });
            gsap.to(bottomLashRef.current, { y: 0, scaleY: 1, transformOrigin: "center bottom", duration: 0.3, ease: "power2.out" });
        } else {
            // Animate Eye Closed (Flattens the top and bottom paths perfectly toward the center axis)
            gsap.to(irisRef.current, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.inOut" });
            gsap.to(topLashRef.current, { y: 4, scaleY: 0.1, transformOrigin: "center top", duration: 0.25, ease: "power2.inOut" });
            gsap.to(bottomLashRef.current, { y: -4, scaleY: 0.1, transformOrigin: "center bottom", duration: 0.25, ease: "power2.inOut" });
        }
    }, [isPublic]);

    return (
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-900 shadow-inner select-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3.5 h-3.5 transition-colors duration-300 ${isPublic ? "text-red-500" : "text-neutral-600"}`}
            >
                {/* Clean, static, standard geometry definitions that GSAP can compress safely */}
                <path ref={topLashRef} d="M2 12c0 0 4-7 10-7s10 7 10 7" />
                <path ref={bottomLashRef} d="M2 12c0 0 4 7 10 7s10-7 10-7" />
                <circle ref={irisRef} cx="12" cy="12" r="3" className="fill-current" />
            </svg>
            <span className={`text-[9px] font-black tracking-widest uppercase transition-colors duration-300 ${isPublic ? "text-red-500" : "text-neutral-500"
                }`}>
                {view}
            </span>
        </div>
    );
}

// edit function
export async function handleEdit(Title: string, Description: string, activityId: number) {
    const res = await fetch(`${BACKEND_URL}/api/activity/edit/${activityId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ Title, Description })
    });
    if (res.ok) {
        alert("Activity updated successfully");
    } else {
        alert("Failed to update activity");
    }
}
export default function YourActivityPage() {
    const threeContainerRef = useRef<HTMLDivElement>(null);
    const listContainerRef = useRef<HTMLUListElement>(null);
    const [activityData, setActivityData] = useState<Activity[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [videopreviewid, setVideopreviewid] = useState<number | null>(null);
    const router = useRouter();
    const [edit, setEdit] = useState<boolean>(false);
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [Title, setTitle] = useState("");
    const [Description, setDescription] = useState("");

    useEffect(() => {
        setMounted(true);
        fetchactivitydata()
            .then((activities) => {
                // Ensure standard fallback defaults exist if backend properties load unassigned initially
                const sanitizedData = activities.map((act: Activity) => ({
                    ...act,
                    View: act.View ? act.View.toUpperCase() : "PRIVATE"
                }));
                setActivityData(sanitizedData);
                setTitle(sanitizedData.length > 0 ? sanitizedData[0].Title || "" : "");
                setDescription(sanitizedData.length > 0 ? sanitizedData[0].Description || "" : "");
                // console.log("Fetched activity data:", sanitizedData);
            })
            .catch((error) => {
                console.error("Error fetching activity data:", error);
            });
    }, []);

    // ─── GSAP ENTRANCE STAGGER ANIMATION ───
    useEffect(() => {
        if (mounted && activityData.length > 0 && listContainerRef.current) {
            gsap.fromTo(
                listContainerRef.current.children,
                { opacity: 0, x: -30, filter: "blur(4px)" },
                { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [mounted, activityData]);

    // ─── THREE.JS MATRIX BACKGROUND SYSTEM ───
    useEffect(() => {
        if (!mounted || !threeContainerRef.current) return;
        const container = threeContainerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1000;
            positions[i + 1] = (Math.random() - 0.5) * 1000;
            positions[i + 2] = (Math.random() - 0.5) * 1000;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0xdc2626,
            size: 3,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            particleSystem.rotation.y += 0.0004;
            particleSystem.rotation.x += 0.0002;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!threeContainerRef.current) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        };
    }, [mounted]);

    // ─── ACTION HANDLERS ───
    const handleAction = (type: "public" | "private" | "delete", id: number) => {
        setActiveDropdown(null);

        if (type === "private") {
            updateActivityView(id, "PRIVATE")
                .then(() => {
                    // Update targeted local item visibility immediately upon api verification success
                    setActivityData(prev => prev.map(act => act.Id === id ? { ...act, View: "PRIVATE" } : act));
                    // console.log(`Activity ${id} set to PRIVATE`);
                })
                .catch((error) => {
                    console.error(`Error updating activity to PRIVATE:`, error);
                });
        } else if (type === "public") {
            updateActivityView(id, "PUBLIC")
                .then(() => {
                    setActivityData(prev => prev.map(act => act.Id === id ? { ...act, View: "PUBLIC" } : act));
                    alert("Activity is now PUBLIC.");
                })
                .catch((error) => {
                    console.error(`Error updating activity to PUBLIC:`, error);
                });
        } else if (type === "delete") {
            // console.log(`Executing deletion payload pipeline on node reference: ${id}`);
            // Integrate delete API endpoint filters here
        }
    };


    return (
        <div className="relative min-h-dvh bg-[#030303] text-neutral-200 overflow-x-hidden font-mono selection:bg-red-700 selection:text-white flex flex-col w-full">

            {/* Global Cyber-Grid Layer Masking */}
            {mounted && (
                <>
                    <div ref={threeContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
                </>
            )}

            {/* <Navbar /> */}

            <div className="flex flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <main className="flex-1 space-y-6">

                    {/* Header Component Bar */}
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase italic">
                                YOUR_ACTIVITIES<span className="text-red-600 not-italic">.log</span>
                            </h1>
                            <p className="text-xs text-neutral-500 font-sans">
                                Managed core index references and telemetry streaming records.
                            </p>
                        </div>
                    </div>

                    {/* Data Status Router Matrix */}
                    {activityData.length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-[#09090b]/80 border border-neutral-900 text-neutral-500 text-xs tracking-widest uppercase">
                            NO ACTIVE TELEMETRY RECORDS ENCOUNTERED.
                        </div>
                    ) : (
                        <ul ref={listContainerRef} className="space-y-4 no-scrollbar">
                            {activityData.map((activity) => (
                                <li
                                    key={activity.Id}
                                    style={{ zIndex: activeDropdown === activity.Id ? 60 : 0 }}
                                    className="relative overflow-visible flex items-center justify-between p-5 bg-[#09090b]/80 border border-neutral-900 rounded-xl hover:border-red-950/40 transition-colors shadow-2xl backdrop-blur-md group"
                                >
                                    {/* Accent Node Edge Highlight */}
                                    <div className="absolute left-0 top-0 w-[2px] h-full bg-neutral-900 group-hover:bg-red-600 transition-colors" />

                                    {/* Data Payload Cluster */}
                                    <div className="space-y-2 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold tracking-wider">
                                                <Calendar size={12} className="text-red-600" />
                                                <span className="uppercase text-neutral-400">TIMESTAMP:</span>
                                                {new Date(activity.CreatedAt).toLocaleString()}
                                            </div>

                                            {/* GSAP EYE INTERACTIVE STATUS INDICATOR */}
                                            <AnimatedEye view={activity.View || "PRIVATE"} />
                                        </div>

                                        <div className="flex items-center gap-2 text-xs sm:text-sm font-sans">
                                            <Video size={14} className="text-neutral-600 shrink-0" />
                                            {/* <strong className="text-white font-mono uppercase text-xs tracking-tight shrink-0">URI PATH:</strong> */}
                                            <div className="flex flex-col">
                                                {(videopreviewid !== activity.Id) && (
                                                    <>
                                                        <button className="text-red-500 hover:text-white transition-colors truncate max-w-[220px] sm:max-w-md font-medium underline underline-offset-4 decoration-red-900/50" onClick={() => { setVideopreviewid(activity.Id) }}>
                                                            Preview
                                                        </button>
                                                        <button onClick={() => router.push(`/your-activities/report/${activity.Id}`)} className="text-red-500 hover:text-white transition-colors truncate max-w-[220px] sm:max-w-md font-medium underline underline-offset-4 decoration-red-900/50">
                                                            View Report
                                                        </button>
                                                    </>
                                                )}
                                                {videopreviewid === activity.Id && (
                                                    <>
                                                        <div>
                                                            <video src={activity.VideoUrl} controls className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <button className="text-red-500 hover:text-white transition-colors truncate max-w-[220px] sm:max-w-md font-medium underline underline-offset-4 decoration-red-900/50" onClick={() => { setVideopreviewid(null) }}>
                                                                Close Preview
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {(selectedActivityId === activity.Id) && (
                                            <div className="flex flex-col gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={Title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Enter Title"
                                                    className="w-full px-3 py-2 text-sm text-white bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                                />
                                                <textarea
                                                    value={Description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Enter Description"
                                                    className="w-full px-3 py-2 text-sm text-white bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                                                />
                                                <div className="flex justify-end gap-2" onClick={() => handleEdit(Title, Description, activity.Id)}>
                                                    <button className="bg-blue-400 text-white rounded-xl p-2 w-[20%] ">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Multi-Option Popover Trigger System */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === activity.Id ? null : activity.Id)}
                                            className="relative z-20 p-2 bg-neutral-950 rounded-lg border border-neutral-900 text-neutral-400 hover:text-white hover:border-red-600 transition-all cursor-pointer"
                                        >
                                            <Ellipsis size={18} />
                                        </button>

                                        {/* Action Box Panel Dropdown Menu */}
                                        <AnimatePresence>
                                            {activeDropdown === activity.Id && (
                                                <>
                                                    {/* Screen Dismiss Layer click-out blocker */}
                                                    <div
                                                        className="fixed inset-0 z-50 cursor-default"
                                                        onClick={() => setActiveDropdown(null)}
                                                    />

                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                                        className="absolute right-0 mt-2 w-48 bg-[#09090b] border border-neutral-800 rounded-xl shadow-2xl p-1.5 overflow-hidden backdrop-blur-xl"
                                                        style={{ zIndex: 70 }}
                                                    >
                                                        <button
                                                            onClick={() => handleAction("public", activity.Id)}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer group/item"
                                                        >
                                                            <Globe size={13} className="text-neutral-500 group-hover/item:text-red-500 transition-colors" />
                                                            Make Public
                                                        </button>

                                                        <button
                                                            onClick={() => handleAction("private", activity.Id)}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer group/item"
                                                        >
                                                            <Shield size={13} className="text-neutral-500 group-hover/item:text-red-500 transition-colors" />
                                                            Make Private
                                                        </button>


                                                        <button
                                                            onClick={() => { setEdit(true); setSelectedActivityId(activity.Id); }}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer group/item"
                                                        >
                                                            <Edit size={13} className="text-neutral-400 group-hover/item:text-white transition-colors animate-pulse" />
                                                            Edit
                                                        </button>

                                                        <div className="h-[1px] bg-neutral-900 my-1" />


                                                        <button
                                                            onClick={() => handleAction("delete", activity.Id)}
                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-500 hover:text-white hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer group/item"
                                                        >
                                                            <Trash2 size={13} className="text-red-600 group-hover/item:text-white transition-colors animate-pulse" />
                                                            Delete Node
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}