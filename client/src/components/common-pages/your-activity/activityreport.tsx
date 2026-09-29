"use client";

import { fetchActivityReport } from "../../../../api/dashboard/activity-report";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ActivityReportResponse = {
    success?: boolean;
    status?: number;
    error?: string;
    report?: {
        Status?: string;
        SummaryText?: string;
        AnalysisJson?: unknown;
        ReportJson?: unknown;
        [key: string]: unknown;
    } | null;
};

export default function ActivityReportPage() {
    const params = useParams();

    const activityId = Array.isArray(params.activityId)
        ? params.activityId[0]
        : params.activityId;

    const [reportData, setReportData] =
        useState<ActivityReportResponse | null>(null);

    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!activityId) return;

            try {
                setLoading(true);
                setError(null);

                const data = await fetchActivityReport(activityId);

                setReportData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch activity report.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activityId]);

    const report = reportData?.report;

    return (
        <div className="min-h-screen bg-black text-white px-6 py-8">

            <div className="mx-auto max-w-6xl">

                <div className="mb-8 border-l-4 border-red-600 pl-4">
                    <h1 className="text-4xl font-bold">
                        Activity Report
                    </h1>

                    <p className="mt-2 text-gray-400">
                        AI generated performance analysis for this activity.
                    </p>
                </div>

                {loading && (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
                        <p className="text-gray-300">
                            Generating report...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-700 bg-red-950 p-6">
                        <h2 className="font-semibold text-red-400">
                            Error
                        </h2>

                        <p className="mt-2 text-gray-300">
                            {error}
                        </p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    (reportData?.status === 404 || !report) && (
                        <div className="rounded-xl border border-yellow-700 bg-yellow-950 p-6">
                            <h2 className="font-semibold text-yellow-400">
                                Report Not Ready
                            </h2>

                            <p className="mt-2 text-gray-300">
                                The report is still being generated.
                                Please check again in a few moments.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    report?.Status === "PENDING" && (
                        <div className="rounded-xl border border-yellow-700 bg-yellow-950 p-6">
                            <h2 className="font-semibold text-yellow-400">
                                Analysis in Progress
                            </h2>

                            <p className="mt-2 text-gray-300">
                                Our AI worker is currently analyzing
                                your uploaded activity.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    report &&
                    report.Status !== "PENDING" && (
                        <div className="space-y-6">

                            <div className="rounded-xl border border-red-600 bg-zinc-900 p-6 shadow-lg shadow-red-900/20">

                                <div className="mb-6 flex items-center justify-between">

                                    <h2 className="text-2xl font-semibold">
                                        Analysis Result
                                    </h2>

                                    <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-semibold">
                                        Completed
                                    </span>

                                </div>

                                {report.SummaryText && (
                                    <div className="mb-8 rounded-lg border border-zinc-800 bg-zinc-950 p-5">

                                        <h3 className="mb-3 text-lg font-semibold text-red-500">
                                            Summary
                                        </h3>

                                        <p className="leading-7 text-gray-300">
                                            {report.SummaryText}
                                        </p>

                                    </div>
                                )}

                                <div>

                                    <h3 className="mb-4 text-lg font-semibold text-red-500">
                                        Detailed Report
                                    </h3>

                                    <p className="overflow-x-auto rounded-lg border border-zinc-800 bg-black p-5 text-sm leading-6 text-gray-300">
                                        {JSON.stringify(
                                            (report.ReportJson as any)?.description ??
                                            report.ReportJson,
                                            null,
                                            2
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}
            </div>
        </div>
    );
}