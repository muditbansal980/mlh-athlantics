import { StaticImageData } from "next/image";

export interface ExerciseStep {
  number: number;
  text: string;
}

export interface DetailedExerciseSchema {
  id: string;
  title: string;
  description: string;
  imageUrl: string | StaticImageData;
  steps: ExerciseStep[];
  precautions: string[];
  references: {
    videoUrl: string;
    blogUrl: string;
  };
}

// Local image tracking imports from your system manifest
import JumpingJacksImage from "../../../../../../../assets/exercises/jumping-jacks.png";
import HighKneesImage from "../../../../../../../assets/exercises/high-knees.png";
import JumpingSquatsImage from "../../../../../../../assets/exercises/jumping-squats.png";
import PlankShoulderTapsImage from "../../../../../../../assets/exercises/plank-shoulder-taps.png";
import JumpLungesImage from "../../../../../../../assets/exercises/jump-lunges.png";

export const JUMPING_JACKS_DETAIL: DetailedExerciseSchema = {
  id: "jumping-jacks",
  title: "Jumping Jacks",
  description: "Synchronized dynamic vertical vector expansion drill. Jump arms & legs out/in continuously to trigger metabolic acceleration.",
  imageUrl: JumpingJacksImage,
  steps: [
    { number: 1, text: "Stand erect with your feet together and arms resting naturally at your sides." },
    { number: 2, text: "In a single fluid movement, jump your feet out laterally while snapping your arms out and up over your head." },
    { number: 3, text: "Immediately reverse the trajectory, jumping your feet back together and dropping your arms back to the starting frame." },
    { number: 4, text: "Maintain a light, springy rhythm on the balls of your feet without pausing between reps." }
  ],
  precautions: [
    "Land with soft knees to prevent high-impact force transmission to your lower spinal joints.",
    "Individuals with chronic ankle or planar fasciitis stress should opt for a low-impact step-out modification."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=1BMSNy7UpEc",
    blogUrl: "https://www.acefitness.org/resources/everyone/exercise-library/jumping-jacks/"
  }
};

export const HIGH_KNEES_DETAIL: DetailedExerciseSchema = {
  id: "high-knees",
  title: "High Knees",
  description: "Rapid high-cadence linear motor sequence. Run in place, driving knees to parallel axis parameters for maximum lower-core compression.",
  imageUrl: HighKneesImage,
  steps: [
    { number: 1, text: "Position your feet hip-width apart while locking your core into an active posture orientation." },
    { number: 2, text: "Drive your right knee upward explosively until it breaks past a parallel plane relative to the floor." },
    { number: 3, text: "As the right foot descends, immediately drive your left knee upward with equal ballistic velocity." },
    { number: 4, text: "Pump your arms in synchronization with your step cadence to maintain full vector speed." }
  ],
  precautions: [
    "Do not lean backward to meet your knees; keep your thoracic column stacked vertically over your hips.",
    "Ensure you land entirely on the balls of your feet to minimize tibial stress fractures."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=ZNDHivdQ7vM",
    blogUrl: "https://www.healthline.com/health/fitness-exercise/high-knees"
  }
};

export const SQUAT_JUMPS_DETAIL: DetailedExerciseSchema = {
  id: "squat-jumps",
  title: "Squat Jumps",
  description: "Ballistic lower-chassis kinetic array. Execute deep squat depth transitioning instantly into explosive vertical propulsion metrics.",
  imageUrl: JumpingSquatsImage,
  steps: [
    { number: 1, text: "Set your feet slightly wider than shoulder-width, tracking your toes outward at roughly 15 degrees." },
    { number: 2, text: "Hinge at your hips and drop your pelvis deeply until your thighs cross below parallel parameters." },
    { number: 3, text: "Drive through your mid-foot explosively, launching your entire body upward into maximum vertical clearance." },
    { number: 4, text: "Absorb the landing structural force by catching yourself softly right back into a deep squat position." }
  ],
  precautions: [
    "Never let your knees cave inward (valgus collapse) during either the drive or the deceleration phase.",
    "Avoid landing on flat feet or locking out your knees mid-air or upon impact."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=TxOn_H_TfS4",
    blogUrl: "https://www.verywellfit.com/how-to-do-a-jump-squat-3120054"
  }
};

export const BURPEES_DETAIL: DetailedExerciseSchema = {
  id: "burpees",
  title: "Burpees",
  description: "Multi-stage compound sequence: Squat → Plank → Push-up → Jump. Full scale output targeting absolute physiological thresholds.",
  imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "From a standing frame, drop your hips down and place your hands firmly flat on the floor in front of you." },
    { number: 2, text: "Kick both feet back instantly into a rigid, high-profile plank alignment layout." },
    { number: 3, text: "Perform a full chest-to-floor push-up, maintaining structural lumbar stability." },
    { number: 4, text: "Snap your feet back under your chest and bound upward into an explosive vertical jump, reaching overhead." }
  ],
  precautions: [
    "Do not let your hips sag or loop down into an un-braced extension when kicking back into the plank state.",
    "Keep your abdominal wall pulled tight to isolate and protect your lower lumbar spine."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=dZfeV7UAikA",
    blogUrl: "https://www.menshealth.com/fitness/a19530412/how-to-do-a-burpee/"
  }
};

export const PUSH_UPS_DETAIL: DetailedExerciseSchema = {
  id: "push-ups",
  title: "Standard Push-Ups",
  description: "Precision upper sectoral load alignment. Target internal pectorals and anterior shoulders through deep mechanical extension.",
  imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "Assume a prone high-plank layout with your hands stacked slightly wider than your shoulders." },
    { number: 2, text: "Lower your chest to the floor by bending your elbows, keeping them tucked at a 45-degree tracking vector." },
    { number: 3, text: "Descend until your chest nearly touches the surface, ensuring your neck remains neutral." },
    { number: 4, text: "Drive through your palms to press your body weight upward into full elbow extension." }
  ],
  precautions: [
    "Avoid flaring your elbows wide out to 90 degrees, as this creates excessive anterior shoulder impingement.",
    "Do not allow your head to drop forward or your neck to strain during the concentric portion of the lift."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    blogUrl: "https://www.builtwithscience.com/fitness/how-to-do-pushups/"
  }
};

export const PLANK_SHOULDER_TAPS_DETAIL: DetailedExerciseSchema = {
  id: "plank-shoulder-taps",
  title: "Plank Shoulder Taps",
  description: "Anti-rotation balance stabilization interface. Tap opposite shoulder zones from a hyper-rigid isometric plank layout.",
  imageUrl: PlankShoulderTapsImage,
  steps: [
    { number: 1, text: "Lock yourself into a stable top-of-a-push-up position with your feet set slightly wider than normal." },
    { number: 2, text: "Brace your obliques and raise your right hand to tap your left shoulder frame." },
    { number: 3, text: "Return the hand slowly to the floor without shifting your center of gravity or rocking your torso." },
    { number: 4, text: "Alternate sides, keeping your pelvis completely parallel to the floor matrix." }
  ],
  precautions: [
    "The core goal is anti-rotation; if your hips tilt or twist from side to side, widen your foot placement base.",
    "Do not transfer your body weight forward onto your wrists excessively; pull your energy through your core."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=kDFP7778b84",
    blogUrl: "https://www.purewow.com/wellness/plank-shoulder-taps"
  }
};

export const JUMP_LUNGES_DETAIL: DetailedExerciseSchema = {
  id: "jump-lunges",
  title: "Jump Lunges",
  description: "Unilateral plyometric division matrix. Alternate single-leg structural splits explosively mid-air to generate maximal leg power.",
  imageUrl: JumpLungesImage,
  steps: [
    { number: 1, text: "Step forward with your right foot and lower down into a split lunge layout, bending both knees to 90 degrees." },
    { number: 2, text: "Drive upward plyometrically, launching your body clear into the air." },
    { number: 3, text: "Switch the orientation of your legs in mid-air, bringing your left foot forward and right foot back." },
    { number: 4, text: "Land cleanly and sink straight down into the next deep lunge phase in one continuous motion." }
  ],
  precautions: [
    "Ensure your front knee never tracking extends past your toes during your deceleration drop.",
    "Do not let your back knee collide with the solid ground surface during speed cycles."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=hZImM_v_Wp8",
    blogUrl: "https://www.healthline.com/health/jump-lunges"
  }
};

export const SKATER_JUMPS_DETAIL: DetailedExerciseSchema = {
  id: "skater-jumps",
  title: "Skater Jumps",
  description: "Lateral boundary shift matrix. Propel bodily mass sideways, landing and absorbing forces on a single base structure.",
  imageUrl: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "Stand on your right leg with a soft knee bend, sweeping your left leg backward behind you." },
    { number: 2, text: "Push off your right foot to bound laterally to the left side, launching your body through space." },
    { number: 3, text: "Land softly on your left foot, balancing steadily while allowing your right foot to sweep behind you." },
    { number: 4, text: "Immediately explode back in the opposite direction to repeat the loop sequence." }
  ],
  precautions: [
    "Keep your tracking knee aligned directly over your ankle upon impact absorption to avoid lateral collateral ligament shear.",
    "If you lack single-leg stabilization metrics, reduce the lateral distance of your jump."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=4R3DSuM7itA",
    blogUrl: "https://www.openfit.com/how-to-do-skater-jumps"
  }
};

export const PLANK_JACKS_DETAIL: DetailedExerciseSchema = {
  id: "plank-jacks",
  title: "Plank Jacks",
  description: "Hybrid core-cardio fusion routine. Jump feet out and inward while managing a locked, low-profile horizontal forearm plank.",
  imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "Set yourself up in a standard low-profile forearm plank with elbows under your shoulders and feet together." },
    { number: 2, text: "Hop both feet outward symmetrically, wider than your shoulder boundaries, similar to a horizontal jumping jack." },
    { number: 3, text: "Quickly hop your feet back together to meet at the center starting baseline." },
    { number: 4, text: "Keep your upper torso completely still and your hips level during the entire jump flight phase." }
  ],
  precautions: [
    "Do not let your lower back sag downward toward the floor when hopping your feet wide.",
    "Keep your shoulder blades pushed away from each other (protraction) to prevent joint collapsing."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=gS9m8S9vO9M",
    blogUrl: "https://www.womenshealthmag.com/fitness/a30182416/plank-jacks/"
  }
};

export const RUSSIAN_TWISTS_DETAIL: DetailedExerciseSchema = {
  id: "russian-twists",
  title: "Russian Twists",
  description: "Rotational vector abdominal sequence. Torque the midsection side-to-side under standard isometric V-sit stress factors.",
  imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "Sit on the floor with your knees bent, leaning your upper spine back to an approximate 45-degree angle." },
    { number: 2, text: "Lift your feet slightly off the floor surface to create an isometric V-sit balance state." },
    { number: 3, text: "Interlock your hands and rotate your rib cage and shoulders fully from one side to the other." },
    { number: 4, text: "Follow your hands with your gaze to ensure true thoracic spine rotation occurs." }
  ],
  precautions: [
    "Do not just swing your arms across your body; you must rotate your actual trunk to engage your internal obliques.",
    "If you feel pinching or pressure in your lower spine area, drop your heels back down flat onto the floor."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    blogUrl: "https://www.scarymommy.com/fitness/how-to-do-russian-twists"
  }
};

export const SIDE_PLANK_HIP_LIFTS_DETAIL: DetailedExerciseSchema = {
  id: "side-plank-hip-lifts",
  title: "Side Plank Hip Lifts",
  description: "Lateral chain structural optimization. Raise and drop pelvis borders from a unilateral static side-plank base line.",
  imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&auto=format&fit=crop&q=80",
  steps: [
    { number: 1, text: "Lie on your side with your elbow directly beneath your shoulder frame, stacking your ankles together." },
    { number: 2, text: "Lift your pelvis up into a crisp, straight line configuration from head to foot." },
    { number: 3, text: "Slowly lower your bottom hip toward the floor, stopping just an inch before contact." },
    { number: 4, text: "Contract your lower obliques dynamically to drive your pelvis back up into peak extension parameters." }
  ],
  precautions: [
    "Ensure your supporting elbow remains aligned beneath your shoulder socket joint to prevent rotator cuff strains.",
    "Keep your chest open and front-facing; do not allow your upper shoulder to tilt forward."
  ],
  references: {
    videoUrl: "https://www.youtube.com/watch?v=vVjV-7P7RVM",
    blogUrl: "https://www.livestrong.com/article/544321-side-plank-hip-dips/"
  }
};

// Composite index dictionary export configuration for seamless routing pages lookups
export const EXERCISE_DETAILS_MAP: Record<string, DetailedExerciseSchema> = {
  "jumping-jacks": JUMPING_JACKS_DETAIL,
  "high-knees": HIGH_KNEES_DETAIL,
  "squat-jumps": SQUAT_JUMPS_DETAIL,
  "burpees": BURPEES_DETAIL,
  "push-ups": PUSH_UPS_DETAIL,
  "plank-shoulder-taps": PLANK_SHOULDER_TAPS_DETAIL,
  "jump-lunges": JUMP_LUNGES_DETAIL,
  "skater-jumps": SKATER_JUMPS_DETAIL,
  "plank-jacks": PLANK_JACKS_DETAIL,
  "russian-twists": RUSSIAN_TWISTS_DETAIL,
  "side-plank-hip-lifts": SIDE_PLANK_HIP_LIFTS_DETAIL,
};