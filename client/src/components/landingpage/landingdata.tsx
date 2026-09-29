export const FEATURES = [
  {
    id: 1,
    icon: "🏆",
    title: "Contest Participation",
    slogan: "Compete. Conquer. Claim Your Crown.",
    description:
      "Discover and join sport contests from your city, region, or globally. Filter by sport, age group, or skill level. Get notified about deadlines and results in real time.",
  },
  {
    id: 2,
    icon: "🎥",
    title: "AI Video Analysis & Points",
    slogan: "Upload. Perform. Get Rewarded.",
    description:
      "Record your workout or skill drill, upload it, and let our AI engine analyse your form, reps, and intensity. Earn XP points instantly based on your performance quality.",
  },
  {
    id: 3,
    icon: "🤝",
    title: "Connect with Coaches",
    slogan: "The Right Coach Changes Everything.",
    description:
      "Browse verified coaches across 30+ sports. View their specialties, ratings, and availability. Book 1-on-1 or group sessions directly through the platform.",
  },
  {
    id: 4,
    icon: "📣",
    title: "Contest Discovery",
    slogan: "Never Miss the Field Again.",
    description:
      "Personalised contest feed based on your sport profile. AI recommends contests that match your current skill level and goals so you always find the right challenge.",
  },
  {
    id: 5,
    icon: "🔥",
    title: "Activity Streaks",
    slogan: "Show Up Every Day. Watch the Fire Grow.",
    description:
      "Every day you upload an activity, your streak counter climbs. Maintain streaks to unlock bonus points, badge rewards, and exclusive contest entries.",
  },
  {
    id: 6,
    icon: "📊",
    title: "Live Leaderboard",
    slogan: "Your Rank Is Waiting. Go Get It.",
    description:
      "See where you stand among athletes in your city, sport, or age group. Leaderboard updates in real time after every upload — every rep counts.",
  },
];

export const VIDEO_STEPS = [
  {
    id: 1,
    emoji: "📱",
    label: "Record",
    description: "Film your push-up set",
  },
  {
    id: 2,
    emoji: "⬆️",
    label: "Upload",
    description: "One tap to submit",
  },
  {
    id: 3,
    emoji: "🤖",
    label: "AI Scores",
    description: "Form & reps analysed",
  },
  {
    id: 4,
    emoji: "🏅",
    label: "Points",
    description: "+340 XP awarded",
  },
  {
    id: 5,
    emoji: "📈",
    label: "Rank Up",
    description: "#142 → #87",
  },
];

export const STREAK_MILESTONES = [
  { days: 1,   label: "Day 1",   bonus: "Start",    color: "bg-gray-200 text-gray-600" },
  { days: 7,   label: "Day 7",   bonus: "2× XP",    color: "bg-lime-400 text-lime-900" },
  { days: 30,  label: "Day 30",  bonus: "Badge ⚡",  color: "bg-orange-400 text-white"  },
  { days: 100, label: "Day 100", bonus: "Legend 👑", color: "bg-yellow-400 text-yellow-900" },
];

export const FAQS = [
  {
    id: 1,
    question: "How does the AI video analysis work?",
    answer:
      "You upload a short video of your activity. Our computer-vision model detects your joints and movement patterns, scores form and intensity, then awards XP points — all within seconds.",
  },
  {
    id: 2,
    question: "Is the platform free to join?",
    answer:
      "Yes! Creating an account and participating in public contests is completely free. Premium plans unlock advanced analytics and priority coach booking.",
  },
  {
    id: 3,
    question: "How do streaks work?",
    answer:
      "Upload any valid activity video once per day to maintain your streak. Miss a day and it resets. Streaks of 7, 30, and 100 days unlock special milestone badges and bonus XP multipliers.",
  },
  {
    id: 4,
    question: "Can coaches verify my progress?",
    answer:
      "Absolutely. Coaches connected to your profile can view your uploaded videos and AI scores, then add their own notes and drills to your training plan.",
  },
  {
    id: 5,
    question: "What sports are supported?",
    answer:
      "We support 30+ sports at launch including football, basketball, athletics, swimming, martial arts, gymnastics, and more — with new sports added every quarter.",
  },
];

export const STATS = [
  { value: "12,400+", label: "Athletes Registered" },
  { value: "340",     label: "Avg XP per Upload"   },
  { value: "98+",     label: "Contests per Month"  },
];

export const NAV_LINKS = [
  { label: "Features",    href: "#features"     },
  { label: "How It Works",href: "#how-it-works" },
  { label: "Streaks",     href: "#streaks"       },
  { label: "FAQs",        href: "#faqs"          },
];