"use client"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { updateCoachView } from "../../../../../api/coaches/profileview"
function Options({
    display,
    view,
    onChange,
}: {
    display: boolean;
    view: string;
    onChange: (view: string) => void;
}) {
    if (!display) return null;

    return (
        <div className="flex-col absolute bg-white text-black p-2">
            <div className="bg-neutral-200 rounded-md p-2">
                <button className="p-2" onClick={() => onChange("PRIVATE")}>
                    Private
                </button>
            </div>
            <hr className="border-t-2 m-2 border-black" />
            <div className="bg-neutral-200 rounded-md p-2">
                <button className="p-2" onClick={() => onChange("PUBLIC")}>
                    Public
                </button>
            </div>
        </div>
    );
}
export function ViewButton({ coachId, view }: { coachId: string, view: string }) {
    const [display, setDisplay] = useState(false);
    const [selectedView, setSelectedView] = useState(view);
    return (
        <div className="bg-red-500 text-white rounded-4xl p-2 pl-3 text-lg">
            <div className="flex">
                <button>{selectedView || "View"}</button>

                <ChevronDown
                    onClick={() => setDisplay(!display)}
                />

            </div>
            <Options
                display={display}
                view={selectedView}
                onChange={(newView) => {
                    setSelectedView(newView);
                    setDisplay(false);
                    // <------------------------- API call here---------------->
                    updateCoachView(coachId, newView);
                }}
            />
        </div>
    )
}