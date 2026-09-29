// profileData.ts

export interface PublicUser {
  username: string;
  avatar: string;
  bannerImage: string;
  bio: string;
  about: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Certificate {
  id: string;
  heading: string;
  image: string;
  url: string;
  description: string;
}

export interface VideoActivityItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  uploadedAt: string;
}

export const publicUserData: PublicUser = {
  username: "AETHER_STRIKER",
  avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  bannerImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80",
  bio: "Cybernetic Interface Engineer. Absolute Vector Performance Protocol Optimization.",
  about: "Specialized in structural anti-rotation architecture, dynamic state layouts, and responsive fluid telemetry configurations. Deploying full-stack solutions under high-stress system constraints.\n\nOver 5+ years driving high-performance core vectors, maximizing structural framework stability and runtime efficiency metrics."
};

export const publicSocialLinks: SocialLink[] = [
  { label: "GITHUB", url: "https://github.com" },
  { label: "LINKEDIN", url: "https://linkedin.com" },
  { label: "TWITTER", url: "https://twitter.com" },
  { label: "PORTFOLIO", url: "https://google.com" }
];

export const publicCertificates: Certificate[] = [
  {
    id: "cert-1",
    heading: "Advanced Neural Matrix Routing",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=80",
    url: "https://google.com",
    description: "Validation of complete mastery over high-dimensional neural pathway deployment architectures, structural data bindings, and asynchronous vector processing nodes."
  },
  {
    id: "cert-2",
    heading: "Quantum Kernel Compilation Protocol",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80",
    url: "https://google.com",
    description: "Certification in execution optimization algorithms, zero-latency system states, and physical infrastructure matrix telemetry layout design."
  }
];

export const publicVideoActivities: VideoActivityItem[] = [
  {
    id: "vid-1",
    title: "Kinetic Vector Telemetry Run",
    description: "Analyzing high-frequency kinetic movement vectors under deep load simulations.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-42079-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
    uploadedAt: "JUNE 18, 2026"
  },
  {
    id: "vid-2",
    title: "Anti-Rotation Core Stability Test",
    description: "Full stress monitoring setup checking structural alignment during isometric phase shifts.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-41913-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&auto=format&fit=crop&q=80",
    uploadedAt: "JUNE 12, 2026"
  },
  {
    id: "vid-3",
    title: "Hyper-Core Interface Overhaul",
    description: "Compiling asynchronous state drivers live validation sequence parameters.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-blue-lights-42205-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&auto=format&fit=crop&q=80",
    uploadedAt: "JUNE 05, 2026"
  }
];
export const publicAchievements = [
  {
    id: "ach-1",
    title: "VECTOR CONSOLE OVERHAUL v2.0",
    date: "MAY 2026",
    description: "Successfully re-architected the core system telemetry pipeline, dropping layout latency indices by 42%. Managed the integration of dynamic multi-touch gestures and hardware-accelerated tracking matrix nodes over a 3-week sprint cycle.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80", 
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80"
    ]
  },
  {
    id: "ach-2",
    title: "VECTOR CONSOLE OVERHAUL v2.0",
    date: "MAY 2026",
    description: "Successfully re-architected the core system telemetry pipeline, dropping layout latency indices by 42%. Managed the integration of dynamic multi-touch gestures and hardware-accelerated tracking matrix nodes over a 3-week sprint cycle.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80", 
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80"
    ]
  }
];