"use client";

import { fetchTasksForReviewing } from "../../../../api/admin/tasks/fetchingtasksforreviewing";
import { useEffect, useState } from "react";
import { approvalfortask, rejectionfortask } from "../../../../api/admin/tasks/resultofreviewingtasks";

export default function ReviewTasks() {
    const [tasksForReviewing, setTasksForReviewing] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTasksForReviewing() {
            const data = await fetchTasksForReviewing();

            if (data && !data.error) {
                setTasksForReviewing(data);
            } else {
                console.error("Error loading tasks:", data.error);
            }

            setLoading(false);
        }

        loadTasksForReviewing();
    }, []);

    const handleApprove = async (taskId: string) => {
        // console.log("Approve:", taskId);

        // Call approve API here
    };

    const handleReject = async (taskId: string) => {
        // console.log("Reject:", taskId);

        // Call reject API here
    };

    if (loading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-stone-50">
                <p className="text-stone-600">Loading review queue...</p>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <h1 className="text-2xl font-bold text-stone-900">
                        Task Review Dashboard
                    </h1>

                    <p className="text-sm text-stone-500 mt-1">
                        Review submitted user activities
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {tasksForReviewing.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-stone-200">
                        <p className="text-stone-500">
                            No tasks currently submitted for review.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tasksForReviewing.map((task) => (
                            <div
                                key={task.Id}
                                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
                            >
                                <div className="grid lg:grid-cols-2 gap-6 p-6">
                                    {/* Left Section */}
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-blue-600">
                                                {/* // will upgrade to show task title instead of task ID in future after joining with Tasks table in the query */}
                                                TaskId:-  {task.TaskId}
                                            </h2>
                                            <p className="text-blue-600 mt-2">
                                                {task.Description}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <p className="text-yellow-800">
                                                <span className="font-semibold text-yellow-800">
                                                    Submitted By:
                                                </span>{" "}
                                                {task.UserId}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-yellow-800">
                                                    Submission Status:
                                                </span>
                                            </p>

                                            <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                                {task.SubmissionStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-yellow-800 mb-2">
                                                Video URL
                                            </p>
                                            <a
                                                href={task.VideoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all text-sm"
                                            >
                                                Open Original Video
                                            </a>
                                        </div>
                                    </div>
                                    {/* Right Section */}
                                    <div>
                                        <div className="rounded-xl overflow-hidden border border-stone-200 bg-black">
                                            <video
                                                src={task.VideoUrl}
                                                controls
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="flex gap-3 mt-5">
                                            <button
                                                onClick={() =>
                                                    approvalfortask(task.TaskId, task.UserId).then((res)=>{
                                                        if(res?.success){
                                                            alert("Approved successfully");
                                                        }
                                                    })
                                                }
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    rejectionfortask(task.TaskId).then((res)=>{
                                                        if(res?.success){
                                                            alert("Rejected successfully");
                                                        }
                                                    })
                                                }
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}