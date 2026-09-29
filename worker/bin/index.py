import os
import time
import json
import tempfile
import requests
import redis
import cv2
import mediapipe as mp

# =========================
# CONFIG
# =========================

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# =========================
# REDIS
# =========================

redis_client = redis.from_url(REDIS_URL)

# =========================
# MEDIAPIPE INIT
# =========================

mp_pose = mp.solutions.pose

pose_detector = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

print("✅ MediaPipe initialized")


# =========================
# DOWNLOAD VIDEO
# =========================

def download_video(url: str) -> str:
    local_path = os.path.join(
        tempfile.gettempdir(),
        f"video_{int(time.time())}.mp4"
    )

    response = requests.get(url, stream=True)
    response.raise_for_status()

    with open(local_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    return local_path


# =========================
# FRAME EXTRACTION
# =========================

def extract_frames(video_path: str, fps: int = 1):
    cap = cv2.VideoCapture(video_path)

    original_fps = cap.get(cv2.CAP_PROP_FPS)

    if original_fps <= 0:
        original_fps = 30

    frame_interval = max(int(original_fps / fps), 1)

    frames = []
    frame_count = 0

    while True:
        success, frame = cap.read()

        if not success:
            break

        if frame_count % frame_interval == 0:
            frames.append(frame)

        frame_count += 1

    cap.release()

    return frames


# =========================
# POSE DETECTION
# =========================

def detect_pose(frame):
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = pose_detector.process(rgb_frame)

    if not result.pose_landmarks:
        return {
            "success": False,
            "landmarks": []
        }

    landmarks = []

    for lm in result.pose_landmarks.landmark:
        landmarks.append({
            "x": lm.x,
            "y": lm.y,
            "z": lm.z,
            "visibility": lm.visibility
        })

    return {
        "success": True,
        "totalPoints": len(landmarks),
        "landmarks": landmarks
    }


# =========================
# SCORE
# =========================

def calculate_score(results):
    valid_frames = 0

    for r in results:
        if r["success"]:
            valid_frames += 1

    if len(results) == 0:
        return 0

    return round((valid_frames / len(results)) * 100)


# =========================
# WORKER
# =========================

def worker():
    print("🚀 Worker started...")

    while True:
        try:

            #
            # Replace this section with your RedisJobQueue.claim()
            #
            job_json = redis_client.brpop("video_jobs", timeout=2)

            if not job_json:
                continue

            payload = json.loads(job_json[1])

            print("📦 Job received")

            video_url = payload["videoUrl"]
            user_id = payload["userId"]
            activity_id = payload["activityId"]

            print("🎥 Processing:", video_url)

            # STEP 1
            local_video_path = download_video(video_url)

            # STEP 2
            frames = extract_frames(local_video_path, fps=1)

            print(f"📸 Frames extracted: {len(frames)}")

            # STEP 3
            all_results = []

            for frame in frames:
                pose_result = detect_pose(frame)
                all_results.append(pose_result)

            # STEP 4
            score = calculate_score(all_results)

            print("🏆 Score:", score)

            result_payload = {
                "status": "done",
                "score": score,
                "framesProcessed": len(frames),
                "activityId": activity_id,
                "userId": user_id
            }

            #
            # Replace this with your DB insert
            #
            redis_client.set(
                f"result:{activity_id}",
                json.dumps(result_payload)
            )

            print("✅ Job completed")

        except Exception as e:
            print("❌ Worker error:", e)


if __name__ == "__main__":
    worker()