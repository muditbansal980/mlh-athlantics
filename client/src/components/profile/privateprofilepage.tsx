"use client";

import { use, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import * as THREE from "three";
import { useRouter } from "next/navigation";
// import { fetchUserData } from "../../../api/user/getuserdata";
import { useParams } from "next/navigation";
import { ArrowUpRight, Award, ShieldAlert, FileText, Globe, Video, Edit3, Plus } from "lucide-react";
import ErrorPopup from "../lib/errorpopup";
import { AdminOwnerauthorizationcheck } from "../../../api/authorizationcheck/admin-ownercheck";
import { fetchProfile } from "../../../api/profile/fetchprofile"
import ProfileSearchBar from "@/layouts/searchbar";
import { BACKEND_URL } from "@/config/app";
//types 

type Certificates = {
  Id: string;
  Title: string;
  Description: string;
  IssuedBy: string;
  IssuedDate: string;
  ImageUrl?: string;
  CreatedAt: string;
}

type Achievements = {
  Id: string;
  Title: string
  Description: string
  ImageUrls: string[]
  CreatedAt: Date
  UpdatedAt?: Date
}

type Activities = {
  Id: string
  VideoUrl: string
  Title?: string
  Description?: string
  Category?: string
  CreatedAt: Date
}
type Profile = {
  Id: string
  Bio?: string
  About?: string
  AvatarUrl?: string
  BannerUrl?: string
  SocialLinks?: string[]
  Location?: string
  CreatedAt: Date
  UpdatedAt?: Date

}
type SocialLink = {
  Id: string;
  Url:string;
  Platform:string;
}


export default function PublicProfilePage() {
  const router = useRouter();
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllAbout, setShowAllAbout] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profiledata, setprofiledata] = useState<Profile>()
  const [certificates, setcertificates] = useState([]);
  const [achievemnts, setachievements] = useState<Achievements[]>([]);
  const [socialLinks, setsocialLinks] = useState<SocialLink[]>([]);
  const [publicVideoActivities, setpublicVideoActivities] = useState([]);
  const [errormsg, seterrormsg] = useState("")
  const [errdisplay, setErrdisplay] = useState("hidden")
  const [usernames, setUsernames] = useState<Array<{ Username: string }>>([]);
  const [allowed, setallowed] = useState(false);
  const params = useParams();
  const username = params.username as string
  const x = useMotionValue(0);

  const [searchQuery, setSearchQuery] = useState("");


  //<-------------------- Function to handle search query changes-------------------->
  // <------------------------Start------------------------>
  async function handleSearch(query: string) {
    const res = await fetch(`${BACKEND_URL}/api/profile/search/${username}?query=${encodeURIComponent(query)}`, {
      credentials: "include"
    });
    if (res.ok) {
      const data = await res.json();
      // console.log("Search results:", data);
      const usernames = data;
      // console.log("Fetched usernames:", usernames);
      setUsernames(usernames);
    }
    // console.log("Search query updated:", query);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);
  //  <------------------------End------------------------>


//Function to fetch profile data(including userdata,achievements,activities,certificates) from backend
// Start
  useEffect(() => {
    async function fetchprofiledata() {
      // console.log("Fetching user data... privateprofilepage.tsx");
      const data = await fetchProfile(username);
     if(data.error){
        seterrormsg(data.error)
        setErrdisplay("fixed")
        router.push("/404")
     }
      setUserData(data.user);
      setprofiledata(data.profile)
      setcertificates(data.certificates)
      setachievements(data.achievements)
      setpublicVideoActivities(data.activities)
      setsocialLinks(data.socialLinks)
      // console.log("Fetched user data:", data.socialLinks);
      // console.log("fetched profile data from backend", data)
    }
    fetchprofiledata();
  }, []);
//End

//timer
useEffect(() => {
    if (errdisplay === "fixed") {
      const timer = setTimeout(() => {
        setErrdisplay("hidden");
      }, 5000); 
    }
  }, [errdisplay])

// authorization check
//Start
  useEffect(() => {
    if (userData) {
      async function AuthorizationCheck() {
        const check = await AdminOwnerauthorizationcheck(userData.Id)
        setallowed(check?.allowed)
      }
      AuthorizationCheck()
    }
  }, [userData])
//End


// Mounting`
//Start
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && scrollRef.current) {
      setTrackWidth(scrollRef.current.scrollWidth);
    }
  }, [mounted]);
//End


  // ─── THREE.JS PARTICLE BACKDROP ───
  useEffect(() => {
    if (!mounted || !threeContainerRef.current) return;
    const container = threeContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = (Math.random() - 0.5) * 800;
      positions[i + 2] = (Math.random() - 0.5) * 800;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xdc2626,
      size: 2.5,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      starField.rotation.y += 0.0006;
      starField.rotation.x += 0.0003;
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

  const baseSpeed = -1.5;

  useAnimationFrame(() => {
    if (!mounted || isHovered || isDragging || trackWidth === 0) return;
    let currentX = x.get() + baseSpeed;
    const thirdWidth = trackWidth / 3;
    if (currentX <= -thirdWidth) {
      currentX += thirdWidth;
    }
    x.set(currentX);
  });

  const handleDragUpdate = () => {
    let currentX = x.get();
    const thirdWidth = trackWidth / 3;
    if (currentX <= -thirdWidth) {
      x.set(currentX + thirdWidth);
    } else if (currentX > 0) {
      x.set(currentX - thirdWidth);
    }
  };
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030303] text-neutral-200 font-mono">
        <p className="text-lg text-neutral-400">Loading user data...</p>
      </div>
    )
  }
  return (
    <div className="relative min-h-dvh w-full bg-[#030303] text-neutral-200 overflow-x-hidden font-mono selection:bg-red-700 selection:text-white">
      {/* <Navbar /> */}
      <ProfileSearchBar onSearch={setSearchQuery} usernames={usernames} />
      {mounted && (
        <>
          <div ref={threeContainerRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1f1215_1px,transparent_1px),linear-gradient(to_bottom,#1f1215_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        </>
      )}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ─── HEADER / IDENTITY SECTION ─── */}
        <section className="relative bg-[#09090b]/90 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute left-0 top-0 w-[2px] h-full bg-red-600" />

          {/* Banner Matrix Backdrop */}
          <div className="relative w-full h-44 sm:h-60 bg-neutral-950 overflow-hidden border-b border-neutral-900 group/banner">
            <img src={profiledata?.BannerUrl || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80"} alt="Banner" className="w-full h-full object-cover opacity-35 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />

            {/* STATIC EDIT ICON: BOTTOM RIGHT CORNER OF BANNER */}
            {allowed && (
              <button onClick={() => router.push(`/profile/${userData?.Username}/edit/banner`)} className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600 backdrop-blur-md transition-all cursor-pointer z-20">
                <Edit3 size={14} />
              </button>
            )}
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-20 sm:-mt-24 mb-6">

              {/* Profile Pic Container */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-black border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] shrink-0 z-10 group/avatar">
                <img src={profiledata?.AvatarUrl || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80"} alt={"Username"} className="w-full h-full object-cover rounded-xl" />

                {/* STATIC EDIT ICON: OVERLAPPING BOTTOM OF PROFILE CIRCLE/BOX */}
                {allowed && (
                  <button onClick={() => router.push(`/profile/${userData?.Username}/edit/avatar`)} className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600 backdrop-blur-md transition-all cursor-pointer z-20">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>

              {/* Username & Small Bio */}
              <div className="space-y-1 mb-2 w-full">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
                  {userData?.Username}
                </h1>
                <div className="flex justify-between w-[100%]">
                  <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-2xl font-medium">
                    {profiledata?.Bio || "Bio"}
                  </p>
                  {allowed && (
                    <button onClick={() => router.push(`/profile/${username}/edit/bio`)}>
                      <Edit3 size={14} className="text-neutral-400 hover:text-white transition-colors cursor-pointer" />
                    </button>)
                  }
                </div>
              </div>
            </div>

            {/* AUTOPLAYING SOCIAL MEDIA NODES TRACK */}
            <div className="relative w-full border-t border-neutral-900 pt-4 overflow-hidden mask-image-[linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)]">
              <div className="flex gap-8 animate-social-marquee hover:[animation-play-state:paused] whitespace-nowrap w-max">
                {socialLinks.map((link: SocialLink, idx) => (
                  <a
                    key={`${link.Id}`}
                    href={link.Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Globe size={12} className="text-red-600" />
                    {link.Platform}
                  </a>
                ))}
              </div>
              <Edit3 onClick={()=>{router.push(`/profile/${userData?.Username}/edit/socialLinks`)}} size={36} className="absolute top-2 bg-black right-3 p-2 pb-3 rounded-lg border border-neutral-80 border-black hover:border-red-600 backdrop-blur-md transition-all cursor-pointer" />
            </div>
          </div>
        </section>

        {/* ─── ABOUT SECTION ─── */}
        <motion.section layout className="relative bg-[#09090b]/80 border border-neutral-900 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
            <h2 className="text-xs font-black tracking-[0.3em] text-neutral-400 uppercase flex items-center gap-2">
              <ShieldAlert size={14} className="text-red-600" /> Core Description
            </h2>
            {/* EDIT BUTTON INLINE WITH HEADING CORE DESCRIPTION */}
            {allowed && (
              <button onClick={() => router.push(`/profile/${userData?.Username}/edit/about`)} className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer">
                <Edit3 size={13} />
              </button>
            )}
          </div>

          <motion.div
            layout="position"
            className={`font-sans text-xs sm:text-sm text-neutral-400 space-y-4 overflow-hidden ${showAllAbout ? "max-h-[1000px]" : "max-h-20 line-clamp-3"}`}
          >
            {profiledata?.About || "About"}
          </motion.div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowAllAbout(!showAllAbout)}
              className="text-[10px] font-black tracking-widest uppercase text-red-500 hover:text-white border border-red-900/50 hover:border-red-600 bg-red-950/10 px-3 py-1.5 rounded transition-all cursor-pointer"
            >
              {showAllAbout ? "Collapse Logs ▲" : "Expand Full Description ▼"}
            </button>
          </div>
        </motion.section>

        {/* ─── LIVE VIDEO TELEMETRY SECTION ─── */}
        <section className="relative bg-[#09090b]/80 border border-neutral-900 py-6 rounded-2xl backdrop-blur-md overflow-hidden select-none">
          <div className="flex items-center justify-between px-6 sm:px-8 border-b border-neutral-900 pb-4 mb-6">
            <h2 className="text-xs font-black tracking-[0.3em] text-neutral-400 uppercase flex items-center gap-2">
              <Video size={14} className="text-red-600 animate-pulse" /> Live Telemetry Feeds
            </h2>

            {/* ADD AND EDIT ICON INLINE WITH TELEMETRY FEEDS */}
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Add Feed">
                <Plus size={13} />
              </button>
              {allowed && (
                <button className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Edit Feeds">
                  <Edit3 size={13} />
                </button>
              )}
            </div>
          </div>

          <div
            ref={containerRef}
            className={`relative w-full overflow-hidden pb-4 cursor-grab active:cursor-grabbing ${isDragging ? 'grabbing-active' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsDragging(false);
            }}
          >
            {mounted ? (
              <motion.div
                ref={scrollRef}
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -(trackWidth * (2 / 3)), right: 0 }}
                dragElastic={0.15}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onDrag={handleDragUpdate}
                className="flex gap-8 w-max px-6 sm:px-8"
              >
                {publicVideoActivities.map((item: Activities, idx) => (
                  <div
                    key={`${item.Id}-${idx}`}
                    className="inline-block w-[300px] sm:w-[450px] md:w-[600px] bg-neutral-950 border border-neutral-900 rounded-xl p-4 overflow-hidden whitespace-normal shrink-0 pointer-events-none group hover:border-red-600/40 transition-colors"
                  >
                    <div className="relative w-full h-[600px] md:h-[400px] bg-black rounded-lg overflow-hidden border border-neutral-900 p-0">
                      <video
                        src={item.VideoUrl}

                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold tracking-wider">
                        <span className="text-red-500 uppercase tracking-widest font-black">RECORD_NODE</span>
                        <span>{item.CreatedAt.toLocaleString()}</span>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">
                        {item.Title || "Title"}

                      </h3>
                      <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                        {item.Description || "Description"}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex gap-8 px-6 sm:px-8 overflow-x-hidden opacity-30">
                {publicVideoActivities.map((item: Activities) => (
                  <div key={item.Id} className="w-[300px] md:w-[600px] h-[750px] md:h-[1350px] bg-neutral-950 border border-neutral-900 rounded-xl shrink-0" />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── CERTIFICATES SECTION ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.3em] text-neutral-400 uppercase">
              <Award size={15} className="text-red-600" /> Secure Credentials Repository
            </div>

            {/* ADD AND EDIT ICON IN FRONT OF CREDENTIALS REPOSITORY */}
            {allowed && (
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Add Certificate">
                  <Plus size={13} />
                </button>

                <button onClick={() => router.push(`/profile/${userData.Username}/edit/certificates`)} className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Edit Certificates">
                  <Edit3 size={13} />
                </button>

              </div>
            )}
          </div>

          <div className="space-y-3">
            {certificates.map((cert: Certificates) => (
              <motion.div
                key={cert.Id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-start md:items-center gap-5 p-5 bg-[#09090b]/80 border border-neutral-900 rounded-xl hover:border-red-900/30 transition-colors group"
              >
                <div className="relative w-full md:w-40 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-900 bg-neutral-950 shrink-0">
                  <img src={cert.ImageUrl} alt="Image" className="w-full h-full object-cover opacity-45 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500" />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                      {cert.Title}
                    </h3>
                    {/* <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                      <ArrowUpRight size={15} />
                    </a> */}
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {cert.Description}
                  </p>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    IssuedBy:{cert.IssuedBy}
                  </p>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    IssuedOn:{cert.IssuedDate}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowAllCertificates(!showAllCertificates)}
              className="flex items-center gap-2 px-6 py-2.5 bg-neutral-950 border border-neutral-900 hover:border-red-600 rounded-xl text-xs font-black tracking-widest uppercase text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <FileText size={13} className="text-red-600" />
              {showAllCertificates ? "Show Fewer Credentials" : "Query All Certificates"} →
            </button>
          </div>
        </section>

        {/* ─── ACHIEVEMENTS SECTION ─── */}
        <section className="relative bg-[#09090b]/40 border border-neutral-900 py-6 rounded-2xl backdrop-blur-md overflow-hidden select-none">
          <div className="flex items-center justify-between px-6 sm:px-8 border-b border-neutral-900 pb-4 mb-6">
            <h2 className="text-xs font-black tracking-[0.3em] text-neutral-400 uppercase flex items-center gap-2">
              <Award size={14} className="text-red-600 animate-pulse" /> System Milestones & Achievements
            </h2>
            {/* ADD AND EDIT ICON IN FRONT OF SYSTEM MILESTONES & ACHIEVEMENTS */}
            {allowed && (
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Add Achievement">
                  <Plus size={13} />
                </button>
                <button onClick={() => router.push(`/profile/${username}/edit/achievements`)} className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-500 hover:text-white hover:border-red-600 transition-colors cursor-pointer" title="Edit Achievements">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
          </div>

          <div
            ref={containerRef}
            className={`relative w-full overflow-hidden pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsDragging(false);
            }}
          >
            {mounted ? (
              <motion.div
                ref={scrollRef}
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -(trackWidth * (2 / 3)), right: 0 }}
                dragElastic={0.15}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onDrag={handleDragUpdate}
                className="flex gap-8 w-max px-6 sm:px-8"
              >
                {achievemnts.length == 0 && (
                  <div>
                    No acheivements found
                  </div>
                )}
                {achievemnts.length != 0 && (


                  achievemnts.map((achieve: Achievements) => (
                    <div
                      key={`${achieve.Id}`}
                      className="inline-block w-[320px] sm:w-[480px] md:w-[600px] bg-neutral-950 border border-neutral-900 rounded-xl p-5 overflow-hidden whitespace-normal shrink-0 group hover:border-red-600/40 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[70%]">
                          {achieve.Title}
                        </h3>
                        <span className="text-[9px] text-neutral-500 font-bold tracking-widest bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800">
                          {achieve.CreatedAt.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-400 font-sans leading-relaxed h-24 line-clamp-4 overflow-hidden mb-5">
                        {achieve.Description}
                      </div>

                      {achieve.ImageUrls && achieve.ImageUrls.length > 0 && (
                        <div className="space-y-2 pointer-events-auto">
                          <div className="text-[8px] font-black text-neutral-600 tracking-widest uppercase px-0.5">
                            Attached Media Payloads ({achieve.ImageUrls.length})
                          </div>

                          <div className="flex gap-0 overflow-x-auto w-full no-scrollbar scroll-smooth snap-x snap-mandatory rounded-lg border border-neutral-900 bg-neutral-950">
                            {achieve.ImageUrls.map((imgUrl) => (
                              <div
                                key={`${imgUrl}`}
                                className="relative w-full aspect-video shrink-0 snap-start snap-always group/img"
                              >
                                <img
                                  src={imgUrl}
                                  alt="Achievement reference card"
                                  className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity duration-300"
                                  loading="lazy"
                                />
                                <div className="absolute bottom-2 left-3 text-[8px] bg-black/90 px-1.5 py-0.5 rounded text-neutral-400 font-mono border border-neutral-800 uppercase tracking-wider">
                                  REF_0{imgUrl + 1}
                                </div>
                                <div className="absolute bottom-2 right-3 text-[8px] bg-black/90 px-1.5 py-0.5 rounded text-neutral-500 font-mono border border-neutral-800">
                                  {imgUrl + 1} / {achieve.ImageUrls.length}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <div className="flex gap-8 px-6 sm:px-8 overflow-hidden opacity-25">
                {achievemnts.slice(0, 2).map((ach: Achievements) => (
                  <div key={ach.Id} className="w-[320px] md:w-[600px] h-[350px] bg-neutral-950 border border-neutral-900 rounded-xl shrink-0" />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <footer className="w-full text-center py-12 text-[10px] text-neutral-700 font-bold tracking-[0.4em] uppercase border-t border-neutral-950 mt-12">
        MATRIX. IDENT RECORD VERIFIED
      </footer>

    </div>
  );
}