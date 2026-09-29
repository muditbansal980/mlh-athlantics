import type { Activity } from "@/types/dashboard/activity";

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function transformActivityData(activities: Activity[]) {
  const uploadsMap = new Map<string, number>();

  activities.forEach((activity) => {
    const key = getDateKey(new Date(activity.CreatedAt));

    uploadsMap.set(key, (uploadsMap.get(key) || 0) + 1);
  });

  const chartData = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const current = new Date(today);
    // console.log("Current Date:", current.toLocaleDateString());
    current.setDate(today.getDate() - i);

    const key = getDateKey(current);

    chartData.push({
      day: current.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      uploads: uploadsMap.get(key) || 0,
    });
  }

  return chartData;
}