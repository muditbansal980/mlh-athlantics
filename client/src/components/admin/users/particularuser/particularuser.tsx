"use client";
import { useParams } from "next/navigation";
import { useState,useEffect, use } from "react";
import { sendNotification } from "../../../../../api/admin/sendnotification/sendnotification";
import  ErrorPopup  from "@/components/lib/errorpopup"

export default function ParticularUser() {
    const { receiverId } = useParams() as { receiverId: string };
    //   // console.log("Receiver ID:", receiverId); // Log the receiverId to verify it's being captured correctly
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [displayError, setDisplayError] = useState("hidden");
    const handleSendNotification = async () => {
        try {
            await sendNotification(receiverId, title, message);
            setTitle("");
            setMessage("");
        } catch (error) {
            setErrorMessage("Failed to send notification. Please try again.");
            setDisplayError("fixed");
            console.error("Error sending notification:", error);
        }
    };
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setDisplayError("hidden");
                setErrorMessage("");
            }, 5000); // Hide the error message after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    return (
        <div>
            <ErrorPopup message={errorMessage} display={displayError} />
            <h1>Particular User</h1>
            <p>User ID: {receiverId}</p>
            <button>Send Notification</button>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendNotification}>Send</button>
            </div>
        </div>
    );
}