from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import mediapipe as mp
import cv2
import numpy as np
from typing import List, Dict
import base64
import os

app = FastAPI()

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    model_complexity=1  # 0=Lite, 1=Full, 2=Heavy
)

class PoseDetector:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        
    def process_frame(self, frame_path: str) -> Dict:
        """Process a single frame and return 33 pose landmarks"""
        image = cv2.imread(frame_path)
        if image is None:
            return {"error": "Could not read image"}
        
        # Convert BGR (OpenCV) to RGB (MediaPipe)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        
        # Run pose detection
        results = pose.process(image_rgb)
        
        if not results.pose_landmarks:
            return {"landmarks": [], "message": "No person detected"}
        
        # Extract 33 landmarks
        landmarks = []
        for landmark in results.pose_landmarks.landmark:
            landmarks.append({
                "x": landmark.x,
                "y": landmark.y,
                "z": landmark.z,
                "visibility": landmark.visibility
            })
        
        # Get image dimensions
        height, width = image.shape[:2]
        
        return {
            "landmarks": landmarks,
            "image_width": width,
            "image_height": height,
            "num_landmarks": len(landmarks)
        }
    
    def process_video_frames(self, frames_dir: str) -> List[Dict]:
        """Process all frames in a directory"""
        frames = sorted([f for f in os.listdir(frames_dir) if f.endswith('.png')])
        pose_data = []
        
        for i, frame_file in enumerate(frames):
            frame_path = os.path.join(frames_dir, frame_file)
            result = self.process_frame(frame_path)
            pose_data.append({
                "frame_number": i + 1,
                "frame_file": frame_file,
                **result
            })
        
        return pose_data

detector = PoseDetector()

@app.post("/detect-pose")
async def detect_pose(frame_path: str):
    """Process a single frame"""
    result = detector.process_frame(frame_path)
    return JSONResponse(result)

@app.post("/detect-pose-batch")
async def detect_pose_batch(frames_dir: str):
    """Process multiple frames (video)"""
    pose_data = detector.process_video_frames(frames_dir)
    return JSONResponse({
        "total_frames": len(pose_data),
        "pose_data": pose_data
    })

@app.get("/health")
async def health():
    return {"status": "ok", "mediapipe": "initialized"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)