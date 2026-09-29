"use client";
import { BACKEND_URL } from "@/config/app";
import { useState, useEffect } from "react";
import { ApproveCoachApplication } from "../../../../api/coaches/disposition";
import { RejectCoachApplication } from "../../../../api/coaches/disposition";
type Application = {
    Id: string
    CoachName: string
    AppliedBy: string             
    Email: string
    VerificationDoc: string
    Description?: string
    Status: string
    CreatedAt: Date
}

export default function AllApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            setLoading(true);
            const res = await fetch(`${BACKEND_URL}/api/admin/coaches/getAllApplications`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error(`Error fetching applications: ${res.statusText}`);
            }
            const data = await res.json();
            setApplications(data.Applications || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(coachId: string, userId: string) {
        try {
            const response = await ApproveCoachApplication(coachId, userId);
            if (response.message) {
                alert(response.message);
                fetchApplications(); // Refresh list after successful approval
            } else {
                alert("Failed to approve the application.");
            }
        } catch (error) {
            console.error("Error approving application:", error);
            alert("An error occurred while approving the application.");
        }
    }
    async function handleReject(coachId: string, userId: string) {
        try {
            const response = await RejectCoachApplication(coachId, userId);
            if (response.message) {
                alert(response.message);
                fetchApplications(); // Refresh list after successful rejection
            } else {
                alert("Failed to reject the application.");
            }
        } catch (error) {
            console.error("Error approving application:", error);
            alert("An error occurred while approving the application.");
        }
    }

    if (loading) {
        return <div style={{ padding: "20px" }}>Loading applications...</div>;
    }

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1 style={{ marginBottom: "20px" }}>All Applications</h1>
            
            {applications.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid #ccc" }}>
                            <th style={{ padding: "10px" }}>Coach Name</th>
                            <th style={{ padding: "10px" }}>Email</th>
                            <th style={{ padding: "10px" }}>Status</th>
                            <th style={{ padding: "10px" }}>Verification Document</th>
                            <th style={{ padding: "10px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app: Application) => (
                            <tr key={app.Id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "10px" }}>{app.CoachName}</td>
                                <td style={{ padding: "10px" }}>{app.Email}</td>
                                <td style={{ padding: "10px" }}>
                                    <span style={{ fontWeight: "bold" }}>{app.Status}</span>
                                </td>
                                <td style={{ padding: "10px" }}>
                                    {app.VerificationDoc ? (
                                        <a href={app.VerificationDoc} target="_blank" rel="noopener noreferrer">
                                            <img 
                                                src={app.VerificationDoc} 
                                                alt="Doc Preview" 
                                                style={{ width: "50px", height: "50px", objectFit: "cover", border: "1px solid #ccc" }} 
                                            />
                                        </a>
                                    ) : (
                                        "No Document"
                                    )}
                                </td>
                                {app.Status === "PENDING" && (
                                <td style={{ padding: "10px" }}>
                                    <button 
                                        onClick={() => handleApprove(app.Id, app.AppliedBy)}
                                        style={{ padding: "6px 12px", cursor: "pointer" }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(app.Id, app.AppliedBy)}
                                        style={{ padding: "6px 12px", cursor: "pointer" }}
                                    >
                                        Reject
                                    </button>
                                    
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No applications found.</p>
            )}
        </div>
    );
}