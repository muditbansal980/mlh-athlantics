"use client"
import { getcertificates } from "../../../../../api/profile/getcertificates";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config/app";
import { useParams } from "next/navigation";
import ErrorPopup from "@/components/lib/errorpopup";
import { Edit } from "lucide-react"

type Certificate = {
    Id: number;
    UserId: number;
    Title: string;
    Description: string;
    IssuedBy: string;
    IssuedDate: string;
    ImageUrl?: string;
    CreatedAt: string;
    UpdatedAt?: string;
}
type EditCertWindowProps = {
    display: string;
    certificatedata: Certificate;
    onClose: () => void;
}


async function handleEditCertificate(Username: string, certficateData: Certificate, formData: FormData) {
    const username = Username
    // console.log("data sending to backend for edit cert:-", formData)
    const res = await fetch(`${BACKEND_URL}/api/profile/certificate/${username}/${certficateData.Id}`, {
        "credentials": "include",
        "method": "PATCH",
        body: formData
    })
    if (res.ok) {
        alert("Updated successfully")
    }
}

// NOTE: path order assumed as /delete/certificate/{certificateId}/{username}
// based on what you described — if your route is actually defined as
// /delete/certificate/{username}/{certificateId}, just swap certificateId
// and username below.
async function handleDeleteCertificate(username: string, certificateId: number) {
    const res = await fetch(`${BACKEND_URL}/api/profile/delete/certificates/${certificateId}/${username}`, {
        credentials: "include",
        method: "DELETE",
    })
    if (!res.ok) {
        throw new Error("Failed to delete certificate");
    }
}

export function EditCertWindow({
    display,
    certificatedata,
    onClose
}: EditCertWindowProps) {
    const params = useParams()
    const username = params.username as string
    const [title, setTitle] = useState(certificatedata.Title);
    const [description, setDescription] = useState(certificatedata.Description);
    const [previewUrl, setPreviewUrl] = useState(
        certificatedata.ImageUrl || ""
    );
    const [issuedBy, setIssuedBy] = useState(certificatedata.IssuedBy);
    const [issuedDate, setIssuedDate] = useState(
        certificatedata.IssuedDate
            ? new Date(certificatedata.IssuedDate)
                .toISOString()
                .split("T")[0]
            : ""
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    function handleEditCertificateLocal(e: React.FormEvent) {
        e.preventDefault()
        const formData = new FormData()
        formData.append("title", title);
        formData.append("description", description);
        formData.append("issuedBy", issuedBy);
        if (issuedDate.trim()) {
            formData.append("issuedDate", issuedDate);
        }else{
            formData.append("issuedDate", issuedDate);
        }
        
        if (imageFile) {
            formData.append("certificateImage", imageFile);
        }
        // console.log("formdata in editcert:-", formData)
        handleEditCertificate(username, certificatedata, formData as FormData)
        return;
    }
    return (
        <div className={`${display} top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center`}>
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h1>Edit Certificate</h1>
                <form onSubmit={(e) => handleEditCertificateLocal(e)} className="flex flex-col gap-4 text-black">
                    <input value={title} type="text" name="title" placeholder="Certificate Title" onChange={(e) => setTitle(e.target.value)} required />
                    <input value={description} type="text" name="description" placeholder="Certificate Description" onChange={(e) => setDescription(e.target.value)} required />
                    <input value={issuedBy} type="text" name="issuedBy" placeholder="Issued By" onChange={(e) => setIssuedBy(e.target.value)} required />
                    <input value={issuedDate} type="date" name="issuedDate" placeholder="Issued Date" onChange={(e) => setIssuedDate(e.target.value)} required />
                    <input type="file" name="certificateImage" accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0]
                                setImageFile(e.target.files[0]);
                                setPreviewUrl(
                                    URL.createObjectURL(file)
                                );
                            }
                        }} required />
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Certificate Preview"
                            className="w-full h-40 object-contain border rounded"
                        />
                    )}
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Update
                    </button>
                    <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}
export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [addcertdisplay, setAddcertdisplay] = useState("hidden");
    const [editcert, seteditcert] = useState(false)
    const [certficateData, setcertificateData] = useState<Certificate | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [issuedBy, setIssuedBy] = useState("");
    const [issuedDate, setIssuedDate] = useState("");
    const [errmsg, setErrmsg] = useState("");
    const [errdisplay, setErrdisplay] = useState("hidden");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const params = useParams();
    const username = params.username as string;
    async function handleuploadCerficate(e: React.FormEvent) {
        e.preventDefault();
        // console.log("Uploading certificate with details:", { title, description, issuedBy, issuedDate, imageFile });
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("issuedBy", issuedBy);
        formData.append("issuedDate", issuedDate);
        if (imageFile) {
            formData.append("certificateImage", imageFile);
        }
        const res = await fetch(`${BACKEND_URL}/api/profile/certificate/upload/${username}`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            // console.log("Certificate uploaded successfully:", data);
        } else {
            console.error("Error uploading certificate:", data);
            setErrmsg(data.error || "An error occurred while uploading the certificate.");
            setErrdisplay("fixed");
        }
    }
    function handleuploadCerficateWindow() {
        setAddcertdisplay("fixed");
    }

    async function handleDelete(certificateId: number) {
        if (!confirm("Delete this certificate?")) return;
        try {
            await handleDeleteCertificate(username, certificateId);
            setCertificates((prev) => prev.filter((c) => c.Id !== certificateId));
        } catch (err) {
            console.error("Error deleting certificate:", err);
            setErrmsg("Failed to delete certificate.");
            setErrdisplay("fixed");
        }
    }

    useEffect(() => {
        async function fetchCertificates() {
            try {
                // console.log("Fetching certificates for user:", username);
                const data = await getcertificates(username).then((res) => {
                    // console.log("Certificates fetched successfully:", res);
                    return res;
                }).catch((err) => {
                    console.error("Error fetching certificates:", err);
                    throw err;
                });
                if (data.error) {
                    setErrmsg(data.error);
                    setErrdisplay("fixed");
                } else {
                    setCertificates(data);
                }
            } catch (err) {
                console.error("Error fetching certificates:", err);

                setErrmsg("An error occurred while fetching certificates.");
                setErrdisplay("fixed");
            }
        }

        fetchCertificates();
    }, [username]);

    useEffect(() => {
        if (errdisplay === "fixed") {
            const timer = setTimeout(() => {
                setErrdisplay("hidden");
                setErrmsg("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errdisplay]);
    return (
        <div className="flex flex-col gap-4">
            <ErrorPopup message={errmsg} display={errdisplay} />
            {editcert && certficateData && (
                <EditCertWindow display="fixed" certificatedata={certficateData} onClose={() => seteditcert(false)} />
            )}
            <h1 className="text-2xl font-bold">Certificates</h1>
            {
                certificates.map((cert) => (
                    <div key={cert.Id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{cert.Title}</h2>
                        <p>{cert.Description}</p>
                        <p><strong>Issued By:</strong> {cert.IssuedBy}</p>
                        <p><strong>Issued Date:</strong> {new Date(cert.IssuedDate).toLocaleDateString()}</p>
                        {cert.ImageUrl && (
                            <img src={cert.ImageUrl} alt={cert.Title} className="mt-2 max-w-xs" />
                        )}
                        <div className="flex items-center gap-3 mt-2">
                            <div onClick={() => {
                                seteditcert(true)
                                setcertificateData(cert)
                            }
                            }>
                                <Edit />
                            </div>
                            <button
                                onClick={() => handleDelete(cert.Id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                ))
            }
            <div className={`${addcertdisplay} top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center`}>
                <div className="bg-white p-6 rounded shadow-md w-96">
                    <h2 className="text-xl font-semibold mb-4">Upload Certificate</h2>
                    <form onSubmit={handleuploadCerficate} className="flex flex-col gap-4 text-black">
                        <input type="text" name="title" placeholder="Certificate Title" onChange={(e) => setTitle(e.target.value)} required />
                        <input type="text" name="description" placeholder="Certificate Description" onChange={(e) => setDescription(e.target.value)} required />
                        <input type="text" name="issuedBy" placeholder="Issued By" onChange={(e) => setIssuedBy(e.target.value)} required />
                        <input type="date" name="issuedDate" placeholder="Issued Date" onChange={(e) => setIssuedDate(e.target.value)} required />
                        <input type="file" name="certificateImage" accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }} required />
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Upload
                        </button>
                        <button type="button" onClick={() => setAddcertdisplay("hidden")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
            <button onClick={handleuploadCerficateWindow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Certificate
            </button>
        </div>
    );
}
