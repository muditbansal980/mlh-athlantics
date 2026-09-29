"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, RotateCcw, Upload, X, Maximize2, Minimize2 } from "lucide-react";
import { BACKEND_URL } from "@/config/app";
interface FloatingVideoRecorderProps {
  open: boolean;
  taskId: String;
  onClose: () => void;
  uploadUrl?: string;
}

export function FloatingVideoRecorder({
  open,
  taskId,
  onClose,
  uploadUrl = `${BACKEND_URL}/api/tasks/upload-task-video/${taskId}`,
}: FloatingVideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMini, setIsMini] = useState(true);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.loop = true;
          videoRef.current.controls = true;
          videoRef.current.play();
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      mr.start(1000);
      setIsRecording(true);
    } catch {
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

  const handleClose = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordedVideo(null);
    setIsMini(true); // reset to mini for next open
    chunksRef.current = [];
    onClose();
  }, [onClose]);

  async function uploadVideo() {
    try {
      setIsUploading(true);
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "recording.webm");
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        alert("Video uploaded successfully!");
        handleClose();
      } else if (res.status === 404) {
        alert("User not found");
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop — only in full/expanded mode */}
      {!isMini && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          onClick={handleClose}
        />
      )}
      <div
        style={
          !isMini
            ? {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(420px, 92vw)",
                zIndex: 9999,
              }
            : {
                position: "fixed",
                bottom: "24px",
                right: "16px",
                width: "min(260px, calc(100vw - 32px))",
                zIndex: 9999,
              }
        }
        className="bg-zinc-950 shadow-2xl border border-zinc-800 flex flex-col overflow-hidden rounded-2xl transition-all duration-300 ease-in-out"
      >
        {/* ── Title bar ── */}
        <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 shrink-0"
          style={{ padding: isMini ? "8px 10px" : "12px 16px" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={[
                "shrink-0 rounded-full",
                isRecording ? "bg-red-500 animate-pulse" : "bg-red-600",
                isMini ? "w-2 h-2" : "w-2.5 h-2.5",
              ].join(" ")}
            />
            <span className="text-zinc-300 tracking-widest uppercase font-mono truncate"
              style={{ fontSize: isMini ? "10px" : "11px" }}
            >
              {isMini ? "Recorder" : "Video Recorder"}
            </span>
          </div>

          {/* Resize + Close — always visible, sized for touch */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              onClick={() => setIsMini((v) => !v)}
              className="rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 active:bg-zinc-600 transition"
              style={{ width: isMini ? "28px" : "28px", height: isMini ? "28px" : "28px" }}
              title={isMini ? "Expand" : "Minimise"}
            >
              {isMini ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-700 active:bg-zinc-600 transition"
              style={{ width: isMini ? "28px" : "28px", height: isMini ? "28px" : "28px" }}
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Video area ── */}
        <div
          className="relative bg-black w-full"
          style={{ aspectRatio: isMini ? "16/9" : "9/16" }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted={!recordedVideo}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Recording badge */}
          {isRecording && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-md rounded-full border border-red-500/30"
              style={{ padding: isMini ? "4px 8px" : "6px 12px" }}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <div className="absolute w-1 h-1 rounded-full bg-white" />
              </div>
              {!isMini && (
                <span className="text-white text-xs font-medium tracking-wide">
                  Recording…
                </span>
              )}
            </div>
          )}

          {/* ── MINI mode: record / stop button pinned bottom-right ── */}
          {isMini && (
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-end p-2 bg-gradient-to-t from-black/70 to-transparent">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="flex items-center justify-center rounded-full shadow-lg active:scale-90 transition-transform"
                style={{
                  width: "36px",
                  height: "36px",
                  background: isRecording ? "#dc2626" : "#ffffff",
                }}
              >
                {isRecording ? (
                  <div className="w-3.5 h-3.5 rounded-sm bg-white" />
                ) : (
                  <Camera size={16} className="text-red-600" />
                )}
              </button>
            </div>
          )}

          {/* ── FULL mode: controls overlay ── */}
          {!isMini && (
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-7 pt-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
              {/* Start */}
              {!isRecording && !recordedVideo && (
                <div className="flex justify-center">
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-xl"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
                      <Camera className="text-white" size={26} />
                    </div>
                  </button>
                </div>
              )}

              {/* Stop */}
              {isRecording && (
                <div className="flex justify-center">
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shadow-xl"
                  >
                    <div className="w-8 h-8 rounded-md bg-red-600" />
                  </button>
                </div>
              )}

              {/* Discard / Upload */}
              {recordedVideo && !isRecording && (
                <div className="flex gap-3">
                  <button
                    onClick={discardRecording}
                    className="flex-1 h-12 rounded-2xl bg-zinc-800 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-700 transition"
                  >
                    <RotateCcw size={15} />
                    Discard
                  </button>
                  <button
                    onClick={uploadVideo}
                    disabled={isUploading}
                    className="flex-1 h-12 rounded-2xl bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500 transition disabled:opacity-50"
                  >
                    <Upload size={15} />
                    {isUploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── MINI mode: discard/upload row below the video ── */}
        {isMini && recordedVideo && !isRecording && (
          <div className="flex gap-2 bg-zinc-900 border-t border-zinc-800 p-2">
            <button
              onClick={discardRecording}
              className="flex-1 h-9 rounded-xl bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-700 transition"
            >
              <RotateCcw size={12} />
              Discard
            </button>
            <button
              onClick={uploadVideo}
              disabled={isUploading}
              className="flex-1 h-9 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500 transition disabled:opacity-50"
            >
              <Upload size={12} />
              {isUploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default FloatingVideoRecorder;