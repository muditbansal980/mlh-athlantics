"use client";
import { useState, useEffect } from "react"
import { FloatingVideoRecorder } from "./FloatingVideoRecorder"
import { fetchParticularTaskData } from "../../../../api/tasks/fetchingparticulartaskdata";
import { usePathname } from "next/navigation";
import { fetchParticularTaskDataForUser } from "../../../../api/tasks/fetchingfromusertaskdb";
import { fetchUserData } from "../../../../api/user/getuserdata";
import { useUserData } from "../../../../store/usesUserData";
import { submitTaskforReview } from "../../../../api/tasks/submissiontask";
import { BACKEND_URL } from "@/config/app";
import ErrorPopup from "@/components/lib/errorpopup";

interface Task {
  Id: string,
  Title: string,
  Description: string,
  XPReward: number,
  Status: string,
  CompletedBy: number,
  CreatedAt: string,
}

interface UserTaskData {
  Id: string,
  UserId: string,
  TaskId: string,
  TaskStatus: string
  VideourlStatus: "EMPTY" | "PENDING" | "UPLOADED",
  Videourl: string | null,
  SubmissionStatus: "NOTSUBMITTED" | "SUBMITTED",
  Description: string | null,
  CreatedAt: string,
  UpdatedAt?: string
}

export default function TaskSubmissionDashboard() {
  const [description, setdescription] = useState("");
  const [recorderOpen, setRecorderOpen] = useState(false); // ← new state
  // const [UserId, setUserId] = useState<string>(""); // ← state to hold user ID
  // const [videoStatus, setVideoStatus] = useState< "PENDING" | "UPLOADED">("PENDING");
  const pathname = usePathname();
  const taskId = pathname.split("/").pop() || "";
  // console.log("Extracted task ID from URL:", taskId);
  const [task, setTask] = useState<Task | null>(null);
  const [usertaskdata, setusertaskdata] = useState<UserTaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errormsg, setErrormsg] = useState("");
  const [errdisplay, setErrdisplay] = useState("hidden");
  // 
  useEffect(() => {
    async function loadData() {
      try {
        if (!taskId) return;

        let userId = "";

        // Get user from Zustand or backend
        const currentUser = useUserData.getState().currentUser;

        if (currentUser) {
          // console.log("User data already in Zustand:", currentUser);
          userId = currentUser.Id;
        } else {
          // console.log("No user data in Zustand, fetching from backend...");

          const user = await fetchUserData();

          if (!user || user.error) {
            setErrormsg("Failed to fetch user data.");
            setErrdisplay("fixed");
            return;
          }

          userId = user.Id;
          // console.log("Fetched user:", user);
        }

        // setUserId(userId);

        // Fetch task data and user-task data in parallel
        const [taskData, userTaskData] = await Promise.all([
          fetchParticularTaskData(taskId),
          fetchParticularTaskDataForUser(taskId, userId),
        ]);

        if (taskData && !taskData.error) {
          // console.log("Fetched task data:", taskData);
          setTask(taskData);
        } else {
          setErrormsg("Task not found");
          setErrdisplay("fixed");
        }

        if (userTaskData && !userTaskData.error) {
          // console.log("Fetched user task data:", userTaskData);
          setusertaskdata(userTaskData);
        } else {
          setErrormsg("User task data not found");
          setErrdisplay("fixed");
          setusertaskdata(null);
        }
      } catch  {
        setErrormsg("Error loading dashboard");
        setErrdisplay("fixed");
        // console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [taskId,recorderOpen]); // re-run when taskId or recorderOpen changes to get latest video status

  const handleSubmitReview = async () => {
    if (!task) {
      setErrormsg("No task data available");
      setErrdisplay("fixed");
      return;
    }
    if (!usertaskdata) {
      setErrormsg("No user task data available");
      setErrdisplay("fixed");
      return;
    }
    if (usertaskdata.VideourlStatus !== "UPLOADED") {
      setErrormsg("Video not uploaded yet");
      setErrdisplay("fixed");
      return;
    }
    if (!description.trim() || description.length === 0) {
      setErrormsg("Description is empty");
      setErrdisplay("fixed");
      return;
    }
    const res = await submitTaskforReview(description, taskId);
    if (res?.success) {
      setErrormsg("Task submitted for review successfully!");
      setErrdisplay("fixed");
      setusertaskdata({ ...usertaskdata, SubmissionStatus: "SUBMITTED", Description: description });
    } else {
      setErrormsg(`Failed to submit task for review: ${res?.message}`);
      setErrdisplay("fixed");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!task || !usertaskdata) {
    return (
      <div className="min-h-dvh bg-[#F5F4F0]">
        <main>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-sm font-medium text-stone-700">
                No such task found
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (

    <div className="min-h-dvh bg-[#F5F4F0] font-['DM_Sans',sans-serif]">
      <ErrorPopup message={errormsg} display={errdisplay} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ── Top bar ── */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold text-stone-800 text-sm tracking-tight">Task Dashboard</span>
        </div>
      </header>
      {usertaskdata.SubmissionStatus === "SUBMITTED" ? (
      <main>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-sm font-medium text-stone-700">
              You have already submitted this task for review.
            </p>
          </div>
        </div>
      </main>
    )  : (

        <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* ── Task card ── */}
          <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">Current Task</p>
                  <h1 className="text-xl font-semibold text-stone-900 leading-snug">{task?.Title}</h1>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.8１.588-１.８１h3.46１a１ １ ０ ００．９５１－．６９l１．０７－３．２９２z" />
                  </svg>
                  +{task?.XPReward} XP
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-500 leading-relaxed">{task?.Description}</p>
            </div>
          </section>

          {/* ── Video recorder section ── */}
          <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 pt-5 pb-2 border-b border-stone-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <h2 className="text-sm font-semibold text-stone-700">Activity Recording</h2>
            </div>

            <div className="p-6">
              {usertaskdata?.VideourlStatus === "EMPTY" && (
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-stone-700">No recording yet</p>
                    <p className="text-xs text-stone-400 mt-0.5">Record yourself completing the task</p>
                  </div>
                  <button
                    onClick={() => setRecorderOpen(true)}
                    className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Record Activity
                  </button>
                </div>
              )}

              {usertaskdata?.VideourlStatus === "PENDING" && (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">Uploading to cloud…</p>
                    <p className="text-xs text-stone-400">This may take a moment</p>
                  </div>
                </div>
              )}
              {usertaskdata?.VideourlStatus === "UPLOADED" && (
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-800">Recording uploaded</p>
                      <p className="text-xs text-stone-400">Ready to submit</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Description section ── */}
          <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 pt-5 pb-2 border-b border-stone-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              <h2 className="text-sm font-semibold text-stone-700">Your Description</h2>
            </div>
            <div className="p-6">
              <textarea
                rows={5}
                placeholder="Explain what you built, the approach you took, and any challenges you faced…"
                className="w-full text-sm text-stone-700 placeholder-stone-300 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition font-['DM_Mono',monospace]"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>
          </section>

          {/* ── Submit button ── */}
          <button className="w-full flex items-center justify-center gap-2.5 bg-stone-900 text-white font-semibold text-sm px-6 py-4 rounded-2xl transition-all hover:bg-stone-800 active:scale-[0.98]" onClick={handleSubmitReview}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Submit for Review
          </button>
        </main>
      )}
      {task && (
        <FloatingVideoRecorder
          open={recorderOpen}
          taskId={task?.Id} // ← pass task ID to the recorder
          onClose={() => setRecorderOpen(false)} // ← close recorder on finish
          uploadUrl={`${BACKEND_URL}/api/tasks/upload-task-video/${task?.Id}`} // ← API endpoint for uploading videos
        />
      )}
    </div>
  );
}