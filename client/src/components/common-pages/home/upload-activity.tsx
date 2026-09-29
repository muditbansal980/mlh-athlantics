"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Square,
  RotateCcw,
  Upload,
} from "lucide-react";
import { BACKEND_URL } from "@/config/app";
import { useRouter } from "next/navigation";

export default function VideoRecorder() {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    alert("Please shift to laptop for better experience. Mobile devices may not support all features of this page.");
  },[])
  async function startRecording() {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {

        if (event.data.size > 0) {

          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {

        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        const videoURL = URL.createObjectURL(blob);

        setRecordedVideo(videoURL);

        if (videoRef.current) {

          videoRef.current.srcObject = null;

          videoRef.current.src = videoURL;

          videoRef.current.loop = true;

          videoRef.current.controls = true;

          videoRef.current.play();
        }

        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
      };

      mediaRecorder.start(1000);

      setIsRecording(true);

    } catch (error) {

      console.error(error);

      alert("Camera permission denied");
    }
  }

  function stopRecording() {

    mediaRecorderRef.current?.stop();

    setIsRecording(false);
  }

  function discardRecording() {

    setRecordedVideo(null);

    chunksRef.current = [];

    if (videoRef.current) {

      videoRef.current.src = "";

      videoRef.current.srcObject = null;
    }
  }

  async function uploadVideo() {

    try {

      setIsUploading(true);

      const blob = new Blob(chunksRef.current, {
        type: "video/webm",
      });

      const formData = new FormData();

      formData.append(
        "video",
        blob,
        "recording.webm"
      );

      const res = await fetch(
        `${BACKEND_URL}/api/activity/upload-activity`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }

      );
      if (res.ok) {
        router.push("/your-activities");
        const data = await res.json();

        // console.log(data);
      }
      else if (res.status === 404) {
        alert("User not found");
      }
      else {
        alert("Upload failed");
      }
    } catch (error) {

      console.error(error);

      alert("Upload failed");

    } finally {

      setIsUploading(false);
    }
  }

  return (

    <div className="min-h-dvh bg-black flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* Video Container */}

        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">

          <video
            ref={videoRef}
            autoPlay
            muted={!recordedVideo}
            playsInline
            className="w-full aspect-[9/16] object-cover bg-black"
          />

          {/* Recording Badge */}

          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/30">

              <div className="relative flex items-center justify-center">

                <div className="w-5 h-5 rounded-full bg-red-600 animate-pulse" />

                <div className="absolute w-2 h-2 rounded-full bg-white" />

              </div>

              <span className="text-white text-sm font-medium">
                Recording...
              </span>
            </div>
          )}

          {/* Bottom Controls */}

          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent">

            <div className="flex items-center justify-center gap-4">

              {/* Start Button */}

              {!isRecording && !recordedVideo && (

                <button
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition"
                >

                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">

                    <Camera className="text-white" size={26} />

                  </div>

                </button>
              )}

              {/* Stop Button */}

              {isRecording && (

                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition"
                >

                  <div className="w-8 h-8 rounded-md bg-red-600" />

                </button>
              )}

            </div>

            {/* After Recording Actions */}

            {recordedVideo && !isRecording && (

              <div className="mt-5 flex gap-3">

                <button
                  onClick={discardRecording}
                  className="flex-1 h-12 rounded-2xl bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2"
                >

                  <RotateCcw size={18} />

                  Discard

                </button>

                <button
                  onClick={uploadVideo}
                  disabled={isUploading}
                  className="flex-1 h-12 rounded-2xl bg-red-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  <Upload size={18} />

                  {isUploading
                    ? "Uploading..."
                    : "Upload"}

                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}