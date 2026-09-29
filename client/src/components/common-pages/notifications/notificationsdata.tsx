import { Notifications } from "@/types/notifications";
import { Bell } from "lucide-react";
export function NotificationsData(notifications: Notifications[]) {
    function formatDate(date: string | Date) {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date));
    }
    return (
        <>
            {notifications.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                    <Bell
                        // size={50}
                        className="mx-auto mb-4 text-slate-300 lg:h-20 lg:w-20 l-10 w-10"
                    />

                    <h2 className="text-xl font-semibold text-slate-700">
                        No Notifications
                    </h2>

                    <p className="mt-2 text-slate-500">
                        You're all caught up.
                    </p>

                </div>
            ) : (
                <div className="space-y-5">
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`absolute left-0 top-0 h-full w-1 ${notification.IsRead
                                    ? "bg-slate-300"
                                    : "bg-blue-600"
                                    }`}
                            />
                            <div className="flex flex-col md:flex-row md:justify-between p-4 md:p-6">

                                <div className="flex gap-3 md:gap-5">

                                    <div
                                        className={`flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl ${notification.IsRead
                                            ? "bg-slate-100"
                                            : "bg-blue-100"
                                            }`}
                                    >
                                        <Bell
                                            size={24}
                                            className={
                                                notification.IsRead
                                                    ? "text-slate-500"
                                                    : "text-blue-600"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-base md:text-lg font-semibold text-slate-900">
                                                {notification.Title}
                                            </h2>
                                        </div>
                                        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                                            {notification.Message}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <p className="text-sm text-slate-500">
                                        {formatDate(notification.CreatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}