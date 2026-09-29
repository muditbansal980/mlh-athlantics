export const LEADERBOARD_PLAYERS = [
  { rank: 1, username: "arjun_sharma", xp: 18450, streak: 34, sport: "Athletics" },
  { rank: 2, username: "priya_nair", xp: 16200, streak: 21, sport: "Football" },
  { rank: 3, username: "rohan_mehta", xp: 14880, streak: 15, sport: "Martial Arts" },
  { rank: 4, username: "sneha_kapoor", xp: 12300, streak: 9, sport: "Swimming" },
  { rank: 5, username: "karan_verma", xp: 11750, streak: 12, sport: "Basketball" },
  { rank: 6, username: "divya_reddy", xp: 10900, streak: 7, sport: "Gymnastics" },
  { rank: 7, username: "amit_singh", xp: 9870, streak: 5, sport: "Athletics" },
  { rank: 8, username: "meera_joshi", xp: 9200, streak: 11, sport: "Football" },
  { rank: 9, username: "rahul_gupta", xp: 8650, streak: 3, sport: "Cricket" },
  { rank: 10, username: "pooja_iyer", xp: 7890, streak: 8, sport: "Swimming" },
  { rank: 11, username: "vijay_kumar", xp: 7340, streak: 6, sport: "Basketball" },
  { rank: 12, username: "lakshmi_rao", xp: 6900, streak: 4, sport: "Gymnastics" },
  { rank: 13, username: "suresh_patel", xp: 6450, streak: 2, sport: "Football" },
  { rank: 14, username: "ananya_krishna", xp: 6100, streak: 9, sport: "Athletics" },
  { rank: 86, username: "you", xp: 6340, streak: 7, sport: "Athletics", isYou: true },
] as const;

export const ACTIVITY_DATA = [
  { day: "Mon", uploads: 1 },
  { day: "Tue", uploads: 3 },
  { day: "Wed", uploads: 2 },
  { day: "Thu", uploads: 4 },
  { day: "Fri", uploads: 2 },
  { day: "Sat", uploads: 5 },
  { day: "Sun", uploads: 3 },
  { day: "Mon", uploads: 4 },
  { day: "Tue", uploads: 6 },
  { day: "Wed", uploads: 3 },
  { day: "Thu", uploads: 5 },
  { day: "Fri", uploads: 4 },
  { day: "Sat", uploads: 7 },
  { day: "Sun", uploads: 5 },
];

export const NOTIFICATIONS = [
  { id: 1, text: "Your push-up video earned 340 XP", time: "2m ago", unread: true },
  { id: 2, text: "Coach Vijay commented on your video", time: "1h ago", unread: true },
  { id: 3, text: "You moved to rank #86 — up 55 spots", time: "1h ago", unread: true },
  { id: 4, text: "New contest: City Sprint Challenge", time: "3h ago", unread: false },
  { id: 5, text: "7-day streak — 2x XP bonus active", time: "5h ago", unread: false },
];

export const NAV_LINKS = [
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Coaches", path: "/coaches" },
  { label: "Contests", path: "/contests" },
  { label: "Exercises", path: "/exercises" }
];



export const PLAYER_STATS = {
  rank: 86,
  friends: 24,
};
