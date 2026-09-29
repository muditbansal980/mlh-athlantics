export const SIDEBAR_WIDTH = "20rem";
import { ChartNoAxesCombined } from 'lucide-react';
import {UserStar, Home, Trophy, ShoppingBag, Upload, Dumbbell, Activity, Earth, Target, Settings, X, Bot, StickyNoteCheck } from "lucide-react";
import { Users, Shield, PlusCircle, FolderGit2, CheckSquare, ClipboardList, Layers } from "lucide-react";
import {ChessQueen} from "lucide-react"
export const SIDEBAR_NAV = [
  { label: "Home", path: "/home" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Contests", path: "/contests" },
  { label: "Upload Activity", path: "/upload-activity" },
  { label: "Exercises", path: "/exercises" },
  { label: "Your Activities", path: "/your-activities" },
  // { label: "Explore", path: "/explore" },
  {label:"Coaches",path:"/coaches"},
  { label: "Sports Store", path: "/store" },
  { label: "Tasks", path: "/tasks" },
  {label:"Rewards",path:"/rewards"},

  // { label: "ChatBot", path: "/chatbot" },
  // { label: "Apply for Organization", path: "/applyorg" },
  { label: "Settings", path: "/settings" },
];

export const ADMIN_SIDEBAR_NAV = [
  { label: "All Organizations", path: "/admin/allorgs" },
  { label: "All Users", path: "/admin/allusers" },
  { label: "Add Contest", path: "/contests/add" },
  { label: "Organization Applications", path: "/admin/orgapps" },
  { label: "Add Task", path: "/admin/tasks/add" },
  { label: "Your Contests", path: "/your-contests" },
  { label: "Manage Coaches", path: "/admin/coaches/allaps" },
  {label:"All Coaches",path:"/admin/coaches/allcoaches"},
  { label: "Review Tasks Applications", path: "/admin/tasks/reviewtasks" },
  { label: "Settings", path: "/settings" },
]

export const ORG_SIDEBAR_NAV = [
  { label: "Dashboard", path: "/org/dashboard" },
  { label: "Home", path: "/home" },
   { label: "Contests", path: "/contests" },
  { label: "Upload Activity", path: "/upload-activity" },
  { label: "Exercises", path: "/exercises" },
  { label: "Your Activities", path: "/your-activities" },
  // { label: "Explore", path: "/explore" },
  { label: "Sports Store", path: "/store" },
  { label: "Tasks", path: "/tasks" },

  // { label: "ChatBot", path: "/chatbot" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Create Contest", path: "/contests/add" },
  { label: "Manage Contests", path: "/org/manage-contests" },
  { label: "View Applications", path: "/org/view-applications" },
  { label: "Your Contests", path: "/your-contests" },
  { label: "Settings", path: "/settings" },
]
export const SOCIAL_LINKS = [
  { label: "Instagram", url: "https://instagram.com" },
  { label: "Discord", url: "https://discord.com" },
  { label: "LinkedIn", url: "https://linkedin.com" },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  "Home": <Home size={24} />,
  "Leaderboard": <ChartNoAxesCombined size={24} />,
  "Contests": <Trophy size={24} />,
  "Sports Store": <ShoppingBag size={24} />,
  "Upload Activity": <Upload size={24} />,
  "Exercises": <Dumbbell size={24} />,
  "Your Activities": <Activity size={24} />,
  "Your Contests": <Trophy size={24} />,
  "Tasks": <Target size={24} />,
  // "ChatBot": <Bot size={24} />,
  "Apply for Organization": <StickyNoteCheck size={24} />,
  "Settings": <Settings size={24} />,
  "Coaches": <UserStar size={24} />,
  "Dashboard": <Activity size={24} />,
  "All Organizations": <Layers size={24} />,
  "All Users": <Users size={24} />,
  "Add Contest": <PlusCircle size={24} />,
  "Create Contest": <PlusCircle size={24} />,
  "Organization Applications": <StickyNoteCheck size={24} />,
  "Add Task": <PlusCircle size={24} />,
  "Review Tasks Applications": <CheckSquare size={24} />,
  "Manage Contests": <FolderGit2 size={24} />,
  "View Applications": <ClipboardList size={24} />,
  "Rewards": <ChessQueen size={24} />,
};
