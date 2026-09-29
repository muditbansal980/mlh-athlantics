export type Review = {
    Id: string;
    CommentedBy: string;
    CommentedById: string;
    CommentedByImage?: string;
    Rating: number;
    Date: string;
    Comment: string;
};

export interface CoachContact {
  email: string;
  phone?: string;
  website?: string;
}

export interface CoachData {
  name: string;
  title: string;
  bio: string;
  bannerImage: string;
  profileImage: string;
  location: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  specialties: string[];
  contact: CoachContact; // Grouped contact structure
  reviews: Review[];
}

export const mockCoachData: CoachData = {
  name: "Marcus Vance",
  title: "High-Performance Executive & Athletic Coach",
  bio: "Helping professionals and athletes break through mental barriers and optimize daily performance. Over 10+ years of experience integrating cognitive conditioning with physical excellence.",
  bannerImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  location: "Chicago, USA",
  joinedDate: "Joined Oct 2024",
  followersCount: 1420,
  followingCount: 382,
  specialties: ["Mindset Conditioning", "Strategic Execution", "Leadership", "Habit Building"],
  contact: {
    email: "marcus.vance@coaching.com",
    phone: "+1 (555) 234-5678",
    website: "www.vanceperformance.com"
  },
  reviews: [
    {
      Id: "1",
      CommentedById: "Sarah Jenkins",
      CommentedBy: "Sarah Jenkins",
      CommentedByImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
      Rating: 5,
      Date: "2 days ago",
      Comment: "Marcus completely re-engineered my approach to work-life balance and focus. Absolutely worth every session."
    },
    {
      Id: "2",
      CommentedBy: "David Cole",
      CommentedByImage: "https://images.unsplash.com/photo-1502767089025-6572583495b0?q=80&w=400&auto=format&fit=crop",
      CommentedById: "David Cole",
      Rating: 5,
      Date: "1 week ago",
      Comment: "Incredibly insightful and highly practical frameworks. His athletic background brings an unmatched level of discipline."
    }
  ]
};