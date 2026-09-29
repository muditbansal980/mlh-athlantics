"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import ErrorPopup from "@/components/lib/errorpopup";
import { fetchNotifications } from "../../../../api/notifications/fetchnotifications";
import type { Notifications } from "@/types/notifications";
import { NotificationsData } from "./notificationsdata";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errorDisplay, setErrorDisplay] = useState("hidden");

    useEffect(() => {
        async function loadNotifications() {
            const result = await fetchNotifications();

            if ("error" in result) {
                setError(result.error);
                setErrorDisplay("fixed");
                return;
            }

            setNotifications(result);
        }

        loadNotifications();
    }, []);

    useEffect(() => {
        if (errorDisplay !== "fixed") return;

        const timer = setTimeout(() => {
            setErrorDisplay("hidden");
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorDisplay]);
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <ErrorPopup
                message={String(error)}
                display={errorDisplay}
            />
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">

                <div className="rounded-xl bg-blue-600 p-3">
                    <Bell className="text-white" size={24} />
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Notifications
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Stay updated with your latest activities.
                    </p>
                </div>

            </div>
            {NotificationsData(notifications)}
        </div>
    );
}