import { create } from "zustand";

type Notification = {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

type AppStore = {
  currentStreak: number;
  setCurrentStreak: (streak: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  notifications: Notification[];
  markAllRead: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  currentStreak: 0,
  setCurrentStreak: (streak) => set({ currentStreak: streak }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  notifications: [
    { id: "1", text: "Your push-up video earned 340 XP!", time: "2m ago", unread: true },
    { id: "2", text: "Coach Vijay commented on your video", time: "1h ago", unread: true },
    { id: "3", text: "You moved to rank #87! ▲ +55", time: "1h ago", unread: true },
    { id: "4", text: "New contest: City Sprint Challenge", time: "3h ago", unread: false },
    { id: "5", text: "7-day streak achieved! 2× XP active", time: "5h ago", unread: false },
  ],
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, unread: false })),
    })),
}));