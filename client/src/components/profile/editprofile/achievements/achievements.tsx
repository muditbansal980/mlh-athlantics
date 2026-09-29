"use client"
import { fetchAchievements } from "../../../../../api/profile/fetchingachievements";
import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Edit3, X } from "lucide-react"
import ErrorPopup from "@/components/lib/errorpopup";
import { BACKEND_URL } from "@/config/app";

type Achievemnts = {
    Id: string;
    UserId: number;
    Title: string
    Description: string
    ImageUrls: string[]
    CreatedAt: Date
    UpdatedAt?: Date
}

type AddAchievement = {
    username: string
    display: string
    onClose: () => void
}

type EditAchievementProps = {
    display: string
    data: Achievemnts
    username: string
    onClose: () => void
    // Backend only returns a success message, not the updated row, so the
    // simplest correct thing to do after a save is "go refetch the list".
    onUpdated: () => void
}

// A single image in the edit modal is either something already saved on the
// server (a URL) or a brand-new file picked locally (with its own preview).
// Modeling both as one list makes "replace this one" / "delete this one"
// trivial — there's only one array to splice, not two to keep in sync.
type ImageSlot =
    | { kind: "existing"; url: string }
    | { kind: "new"; file: File; previewUrl: string }

export async function EditAchievementApi(formdata: FormData, achievement: Achievemnts, username: string) {
    const res = await fetch(`${BACKEND_URL}/api/profile/update/achievement/${username}/${achievement.Id}`, {
        credentials: "include",
        method: "PATCH",
        body: formdata
    })
    if (!res.ok) {
        throw new Error("Failed to update achievement");
    }
}

export async function DeleteAchievementApi(username: string, achievementId: string) {
    const res = await fetch(`${BACKEND_URL}/api/profile/delete/achievement/${username}/${achievementId}`, {
        credentials: "include",
        method: "DELETE",
    })
    if(res.ok){
        alert("deleted successfully")
    }
    if (!res.ok) {
        throw new Error("Failed to delete achievement");
    }
}

export function EditAchievement({ display, data, username, onClose, onUpdated }: EditAchievementProps) {
    const MAX_IMAGES = 5;

    const [title, setTitle] = useState(data.Title);
    const [description, setDescription] = useState(data.Description);
    const [slots, setSlots] = useState<ImageSlot[]>(
        data.ImageUrls.map((url) => ({ kind: "existing", url }))
    );
    const [isSaving, setIsSaving] = useState(false);

    const addInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);
    const replaceIndexRef = useRef<number | null>(null);

    function revokeIfNew(slot: ImageSlot) {
        if (slot.kind === "new") URL.revokeObjectURL(slot.previewUrl);
    }

    function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        e.target.value = ""; // lets the user pick the same file again later if needed

        if (!files.length) return;

        if (slots.length + files.length > MAX_IMAGES) {
            alert(`Maximum ${MAX_IMAGES} images allowed`);
            return;
        }

        const added: ImageSlot[] = files.map((file) => ({
            kind: "new",
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setSlots((prev) => [...prev, ...added]);
    }

    function handleReplaceClick(index: number) {
        replaceIndexRef.current = index;
        replaceInputRef.current?.click();
    }

    function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = "";
        const index = replaceIndexRef.current;
        if (!file || index === null) return;

        setSlots((prev) => {
            const next = [...prev];
            revokeIfNew(next[index]);
            next[index] = {
                kind: "new",
                file,
                previewUrl: URL.createObjectURL(file),
            };
            return next;
        });
        replaceIndexRef.current = null;
    }

    function handleDeleteSlot(index: number) {
        setSlots((prev) => {
            revokeIfNew(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    }

    async function handleSave() {
        setIsSaving(true);
        try {
            const formData = new FormData();
            // NOTE: lowercase field names here on purpose — the update
            // endpoint reads req.body.title / req.body.description, unlike
            // the add endpoint which expects "Title" / "Description".
            formData.append("title", title);
            formData.append("description", description);

            const existingImages = slots
                .filter((s): s is { kind: "existing"; url: string } => s.kind === "existing")
                .map((s) => s.url);
            formData.append("existingImages", JSON.stringify(existingImages));

            slots
                .filter((s): s is { kind: "new"; file: File; previewUrl: string } => s.kind === "new")
                .forEach((s) => formData.append("achievements", s.file));

            await EditAchievementApi(formData, data, username);
            onUpdated();
            onClose();
        } catch {
            alert("Failed to update achievement");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={`${display} ml-[50%] w-[50%] bg-black text-white p-4 flex flex-col gap-3`}>
            <input
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="text-black px-2 py-1 rounded"
            />
            <input
                value={description}
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                className="text-black px-2 py-1 rounded"
            />

            <div className="flex gap-2 flex-wrap">
                {slots.map((slot, index) => {
                    const src = slot.kind === "existing" ? slot.url : slot.previewUrl;
                    return (
                        <div key={src} className="relative">
                            <img src={src} className="w-80" alt="preview" />
                            <button
                                type="button"
                                onClick={() => handleReplaceClick(index)}
                                title="Replace image"
                                className="absolute top-1 right-9 bg-white rounded-full p-1"
                            >
                                <Edit3 size={16} className="text-black" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteSlot(index)}
                                title="Delete image"
                                className="absolute top-1 right-1 bg-white rounded-full p-1"
                            >
                                <X size={16} className="text-black" />
                            </button>
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => addInputRef.current?.click()}
                className="bg-blue-400 rounded px-3 py-1 self-start"
            >
                + Add Image
            </button>
            <input ref={addInputRef} type="file" hidden multiple accept="image/*" onChange={handleAddFiles} />
            <input ref={replaceInputRef} type="file" hidden accept="image/*" onChange={handleReplaceFile} />

            <div className="flex gap-2">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-400 rounded w-full disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={onClose} className="bg-gray-500 rounded w-full">
                    Cancel
                </button>
            </div>
        </div>
    )
}

export async function AddAchievementApi(formData: FormData, username: string) {
    const res = await fetch(`${BACKEND_URL}/api/profile/achievement/${username}`, {
        credentials: "include",
        method: "POST",
        body: formData
    })
    if (res.ok) {
        alert("Achievement Uploaded Successfully")
    }
    else {
        alert("Achievement failed")
    }
}

export function AddAchievement({ username, display, onClose }: AddAchievement) {
    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const MAX_IMAGES = 5;
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const uploadbutton = useRef<HTMLInputElement>(null)

    async function handleupload() {
        const formData = new FormData();
        formData.append("Title", Title)
        formData.append("Description", Description)

        images.forEach((image) => {
            formData.append("achievements", image);
        });
        await AddAchievementApi(formData, username);
    }

    function handleRemoveImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    }

    return (
        <div className={`${display} bg-black text-white`}>
            <input type="text" placeholder="Enter Title" onChange={(e) => setTitle(e.target.value)} ></input>
            <input type="text" placeholder="Enter Description" onChange={(e) => setDescription(e.target.value)}></input>
            <button onClick={() => { uploadbutton.current?.click() }} type="button">
                + Add Image
            </button>

            <div className="flex gap-2 flex-wrap">
                {previewUrls.map((url, index) => (
                    <div key={url} className="relative">
                        <img
                            src={url}
                            className="w-64"
                            alt="preview"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            title="Delete image"
                            className="absolute top-1 right-1 bg-white rounded-full p-1"
                        >
                            <X size={16} className="text-black" />
                        </button>
                    </div>
                ))}
            </div>
            {/* hidden input */}
            <input
                ref={uploadbutton}
                type="file"
                hidden
                multiple
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);

                    if (images.length + files.length > MAX_IMAGES) {
                        alert(`Maximum ${MAX_IMAGES} images allowed`);
                        return;
                    }

                    setImages((prev) => [...prev, ...files]);

                    const previews = files.map((file) =>
                        URL.createObjectURL(file)
                    );

                    setPreviewUrls((prev) => [
                        ...prev,
                        ...previews
                    ]);
                }}
            />
            <div className="flex">
                <button onClick={() => handleupload()} className="bg-blue-400 text-white rounded-xl">
                    Upload
                </button>
                <button onClick={onClose} className="bg-blue-400 text-white rounded-xl">
                    Cancel
                </button>
            </div>
        </div>
    )
}


export default function Achievements() {
    const params = useParams();
    const username = params.username as string;
    const router = useRouter();
    const [achievements, setachievements] = useState<Achievemnts[]>([])
    const [showAddAchievement, setShowAddAchievement] = useState(false);
    const [EditWindowDisplay, setEditWindowDisplay] = useState(false)
    const [editdata, seteditdata] = useState<Achievemnts>()
    const [errmsg, seterrmsg] = useState("")
    const [errdisplay, seterrdisplay] = useState<"hidden" | "fixed">("hidden")

    function showError(message: string) {
        seterrmsg(message);
        seterrdisplay("fixed");
    }

    async function loadAchievements() {
        const result = await fetchAchievements(username);
        if (result.error) {
            showError(result.error)
            if (result.status == 401) {
                router.push("/register")
            }
            if (result.status == 404) {
                setachievements([])
            }
        }
        else {
            setachievements(result);
        }
    }

    //fetching achievements from backend
    useEffect(() => {
        loadAchievements();
    }, [username])

    useEffect(() => {
        if (errdisplay !== "fixed") return;
        const timer = setTimeout(() => {
            seterrdisplay("hidden");
            seterrmsg("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [errdisplay]);

    async function handleDelete(achievementId: string) {
        if (!confirm("Delete this achievement?")) return;
        try {
            await DeleteAchievementApi(username, achievementId);
            setachievements((prev) => prev.filter((a) => a.Id !== achievementId));
        } catch {
            showError("Failed to delete achievement.");
        }
    }

    return (
        <div>
            <ErrorPopup message={errmsg} display={errdisplay} />

            {EditWindowDisplay && editdata && (
                <EditAchievement
                    display="fixed"
                    data={editdata}
                    username={username}
                    onClose={() => setEditWindowDisplay(false)}
                    onUpdated={loadAchievements}
                />
            )}
            {showAddAchievement && (
                <AddAchievement
                    username={username}
                    display="fixed"
                    onClose={() =>
                        setShowAddAchievement(false)
                    }
                />
            )}
            {achievements.length != 0 && (
                achievements.map((ach) => (
                    <div key={`${ach.Id}`}>
                        <div>
                            <p>{ach.Title}</p>
                        </div>
                        <div>
                            <p>{ach.Description}</p>
                        </div>
                        <div>
                            {ach.ImageUrls.length != 0 && (
                                (ach.ImageUrls.map((imgsrc) => (
                                    <img key={imgsrc} src={imgsrc} alt="Image" className="w-48" />
                                )))
                            )}
                        </div>
                        <Edit3 onClick={() => { setEditWindowDisplay(true); seteditdata(ach) }} />
                        <button onClick={() => handleDelete(ach.Id)} className="text-red-500">
                            Delete
                        </button>
                    </div>
                )
                )
            )
            }
            {achievements.length == 0 && (
                <div>
                    No achievements
                </div>
            )}
            <button onClick={() => setShowAddAchievement(true)} className="w-full">
                + Add Achievement
            </button>
        </div>
    )
}
