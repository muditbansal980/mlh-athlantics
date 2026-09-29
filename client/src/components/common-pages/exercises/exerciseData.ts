export type ExerciseCategory = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  redirectUrl?: string;
};

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    id: "home-workout",
    title: "Home Workout",
    description: "Basic exercises you can do at home with minimal equipment",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/home-workout"
  },
  {
    id: "gym",
    title: "Gym",
    description: "Weights, machines and strength training",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/gym"
  },
  {
    id: "swimming",
    title: "Swimming",
    description: "Pool and open water training",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/swimming"
  },
  {
    id: "running-athletics",
    title: "Running & Athletics",
    description: "Track, road and trail running",
    imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/running-athletics"
  },
  {
    id: "cycling",
    title: "Cycling",
    description: "Road, mountain and indoor cycling",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/cycling"
  },
  {
    id: "calisthenics",
    title: "Calisthenics",
    description: "Bodyweight strength and skill work",
    imageUrl: "https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/calisthenics"
  },
  {
    id: "yoga",
    title: "Yoga",
    description: "Flexibility, balance and mindfulness",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/yoga"
  },
  {
    id: "martial-arts",
    title: "Martial Arts",
    description: "Combat sports and self defence",
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/martial-arts"
  },
  {
    id: "team-sports",
    title: "Team Sports",
    description: "Football, basketball, cricket and more",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/team-sports"
  },
  {
    id: "racquet-sports",
    title: "Racquet Sports",
    description: "Tennis, badminton, squash and more",
    imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/racquet-sports"
  },
  {
    id: "functional-fitness",
    title: "Functional Fitness",
    description: "HIIT, CrossFit and circuit training",
    imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/functional-fitness"
  },
  {
    id: "rehabilitation",
    title: "Rehabilitation",
    description: "Recovery, physio and injury prevention",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/rehabilitation"
  },
  {
    id: "mobility-stretching",
    title: "Mobility & Stretching",
    description: "Joint health, flexibility and cool-down",
    imageUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&auto=format&fit=crop&q=80",
    redirectUrl: "/exercises/mobility-stretching"
  },
];
