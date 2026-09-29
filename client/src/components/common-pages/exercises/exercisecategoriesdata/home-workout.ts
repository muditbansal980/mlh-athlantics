// homeWorkoutData.ts
import { Zap, Activity, Clock, ShieldAlert } from "lucide-react";
import { StaticImageData } from "next/image";
import HighKneesImage from "../../../../../assets/exercises/high-knees.png";
import JumpLungesImage from "../../../../../assets/exercises/jump-lunges.png";
import JumpingJacksImage from "../../../../../assets/exercises/jumping-jacks.png";
import JumpingSquatsImage from "../../../../../assets/exercises/jumping-squats.png";
import PlankShoulderTapsImage from "../../../../../assets/exercises/plank-shoulder-taps.png";
// 1. STRATEGIC TYPE SAFETY DEFINITIONS
export interface HomeExercise {
    id: string;
    title: string;
    description: string;
    imageUrl: string | StaticImageData;
    redirectUrl: string;
    metadata: {
        difficulty: "BEGINNER" | "INTERACTIVE" | "ADVANCED" | "EXPERT";
        targetMuscle: string;
        estimatedDuration: string;
        energyExpenditure: "Low" | "Medium" | "High" | "Maximum";
        recommendedRepetitions: string;
    };
}

// 2. EXERCISE ARRAYS WITH VISUALLY ACCURATE IMAGES
export const HOME_WORKOUT_EXERCISES: HomeExercise[] = [
    {
        id: "jumping-jacks",
        title: "Jumping Jacks",
        description: "Synchronized dynamic vertical vector expansion drill. Jump arms & legs out/in continuously to trigger metabolic acceleration.",
        imageUrl: JumpingJacksImage,
        redirectUrl: "/exercises/home-workout/jumping-jacks",
        metadata: {
            difficulty: "BEGINNER",
            targetMuscle: "Full Body Cardiorespiratory",
            estimatedDuration: "30 Secs",
            energyExpenditure: "Medium",
            recommendedRepetitions: "Continuous x 30s"
        }
    },
    {
        id: "high-knees",
        title: "High Knees",
        description: "Rapid high-cadence linear motor sequence. Run in place, driving knees to parallel axis parameters for maximum lower-core compression.",
        imageUrl: HighKneesImage,
        redirectUrl: "/exercises/home-workout/high-knees",
        metadata: {
            difficulty: "BEGINNER",
            targetMuscle: "Hip Flexors & Core",
            estimatedDuration: "30 Secs",
            energyExpenditure: "High",
            recommendedRepetitions: "Continuous x 30s"
        }
    },
    {
        id: "squat-jumps",
        title: "Squat Jumps",
        description: "Ballistic lower-chassis kinetic array. Execute deep squat depth transitioning instantly into explosive vertical propulsion metrics.",
        imageUrl: JumpingSquatsImage,
        redirectUrl: "/exercises/home-workout/squat-jumps",
        metadata: {
            difficulty: "ADVANCED",
            targetMuscle: "Quadriceps & Glutes",
            estimatedDuration: "12-15 Reps",
            energyExpenditure: "Maximum",
            recommendedRepetitions: "4 Sets x 15 Reps"
        }
    },
    {
        id: "burpees",
        title: "Burpees",
        description: "Multi-stage compound sequence: Squat → Plank → Push-up → Jump. Full scale output targeting absolute physiological thresholds.",
        imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/burpees",
        metadata: {
            difficulty: "EXPERT",
            targetMuscle: "Total Kinetic Chain",
            estimatedDuration: "10-12 Reps",
            energyExpenditure: "Maximum",
            recommendedRepetitions: "3 Sets x 12 Reps"
        }
    },
    {
        id: "push-ups",
        title: "Standard Push-Ups",
        description: "Precision upper sectoral load alignment. Target internal pectorals and anterior shoulders through deep mechanical extension.",
        imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/pushups",
        metadata: {
            difficulty: "BEGINNER",
            targetMuscle: "Chest & Anterior Delts",
            estimatedDuration: "12-15 Reps",
            energyExpenditure: "Medium",
            recommendedRepetitions: "3 Sets x 15 Reps"
        }
    },
    {
        id: "plank-shoulder-taps",
        title: "Plank Shoulder Taps",
        description: "Anti-rotation balance stabilization interface. Tap opposite shoulder zones from a hyper-rigid isometric plank layout.",
        imageUrl: PlankShoulderTapsImage,
        redirectUrl: "/exercises/home-workout/plank-shoulder-taps",
        metadata: {
            difficulty: "INTERACTIVE",
            targetMuscle: "Transverse Abdominis",
            estimatedDuration: "20 Taps",
            energyExpenditure: "Medium",
            recommendedRepetitions: "3 Sets x 20 Taps"
        }
    },
    {
        id: "jump-lunges",
        title: "Jump Lunges",
        description: "Unilateral plyometric division matrix. Alternate single-leg structural splits explosively mid-air to generate maximal leg power.",
        imageUrl: JumpLungesImage,
        redirectUrl: "/exercises/home-workout/jump-lunges",
        metadata: {
            difficulty: "EXPERT",
            targetMuscle: "Quads, Hamstrings & Glutes",
            estimatedDuration: "10 Each Side",
            energyExpenditure: "Maximum",
            recommendedRepetitions: "3 Sets x 20 Reps"
        }
    },
    {
        id: "skater-jumps",
        title: "Skater Jumps",
        description: "Lateral boundary shift matrix. Propel bodily mass sideways, landing and absorbing forces on a single base structure.",
        imageUrl: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/skater-jumps",
        metadata: {
            difficulty: "INTERACTIVE",
            targetMuscle: "Gluteus Medius & Calves",
            estimatedDuration: "45 Secs",
            energyExpenditure: "High",
            recommendedRepetitions: "4 Sets x 45s"
        }
    },
    {
        id: "plank-jacks",
        title: "Plank Jacks",
        description: "Hybrid core-cardio fusion routine. Jump feet out and inward while managing a locked, low-profile horizontal forearm plank.",
        imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/plank-jacks",
        metadata: {
            difficulty: "INTERACTIVE",
            targetMuscle: "Core & Abductors",
            estimatedDuration: "30 Secs",
            energyExpenditure: "High",
            recommendedRepetitions: "3 Sets x 30s"
        }
    },
    {
        id: "russian-twists",
        title: "Russian Twists",
        description: "Rotational vector abdominal sequence. Torque the midsection side-to-side under standard isometric V-sit stress factors.",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/russian-twists",
        metadata: {
            difficulty: "BEGINNER",
            targetMuscle: "Internal & External Obliques",
            estimatedDuration: "20 Reps",
            energyExpenditure: "Medium",
            recommendedRepetitions: "4 Sets x 20 Reps"
        }
    },
    {
        id: "side-plank-hip-lifts",
        title: "Side Plank Hip Lifts",
        description: "Lateral chain structural optimization. Raise and drop pelvis borders from a unilateral static side-plank base line.",
        imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=80",
        redirectUrl: "/exercises/home-workout/side-plank-hip-lifts",
        metadata: {
            difficulty: "INTERACTIVE",
            targetMuscle: "Obliques & Quadratus Lumborum",
            estimatedDuration: "12 Each Side",
            energyExpenditure: "Medium",
            recommendedRepetitions: "3 Sets x 12 Per Side"
        }
    }
];