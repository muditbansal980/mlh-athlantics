import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker | null = null;

/**
 * Initialize MediaPipe Pose model (call once in worker startup)
 */
export async function initPoseModel() {
  // console.log("It is posedetection")
  if (poseLandmarker) return;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });

  // console.log("✅ MediaPipe Pose model loaded");
}

/**
 * Process a single frame (image) OR video frame
 * You pass image bitmap / canvas / video frame
 */
export async function detectPose(input: any) {
  if (!poseLandmarker) {
    throw new Error("Pose model not initialized. Call initPoseModel first.");
  }

  const result = poseLandmarker.detect(input);

  if (!result.landmarks || result.landmarks.length === 0) {
    return {
      success: false,
      message: "No pose detected",
      landmarks: [],
    };
  }

  // Extract first person (we set numPoses = 1)
  const landmarks = result.landmarks[0];

  return {
    success: true,
    totalPoints: landmarks.length, // usually 33
    landmarks: landmarks.map((point) => ({
      x: point.x,
      y: point.y,
      z: point.z,
    })),
  };
}