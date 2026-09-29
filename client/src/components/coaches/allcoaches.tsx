// "use client"
// import { fetchAllCoaches } from "../../../api/coaches/fetchall";
// import { useState, useEffect } from "react";
// type Coach = {
//     Id: string;
//     Email?: string;
//     CoachName: string;
//     Description:string;
//     CreatedAt: string;
// };
// export default  function CoachesPage() {
//     const [coachesData, setCoachesData] = useState<Coach[]>([]);
//     useEffect(() => {
//         async function fetchData() {
//             const coachesData = await fetchAllCoaches();
//             // console.log("Fetched coaches data:", coachesData);
//             setCoachesData(coachesData);
//         }
//         fetchData();
//     }, []);

// if(!coachesData ) {
//     return (
//         <div>
//             <h1>All Coaches</h1>
//             <p>Error fetching coaches data.</p>
//         </div>
//     );
// }
// return (
//     <div>
//         <h1>All Coaches</h1>
//         {coachesData.length === 0 ? (
//             <p>No coaches found.</p>
//         ) : (
//             <ul>
//                 {coachesData.map((coach: Coach) => (
//                     <li key={coach.Id}>
//                         {coach.CoachName}
//                         <p>{coach.Description}</p>
//                         <p>{coach.CreatedAt.toLocaleString()}</p>
//                         <p>{coach.Email}</p>
//                     </li>
//                 ))}
//             </ul>
//         )}
//     </div>
// );
// }   



"use client"
import { useEffect, useState } from "react";
import { Coach } from "@/types/coaches/coachprofiledata";

import CoachPageHeader from "../utils/coaches/headers/Coachpageheader";
import CoachToolbar from "../utils/coaches/toolbar/coachtoolbar";
import CoachGrid from "../utils/coaches/cards/coachgrid";

import CoachGridSkeleton from "../utils/coaches/skeleton/coachgridskeleton";
import EmptyCoachState from "../utils/coaches/empty/emptycoachstate";
import CoachPagination from "../utils/coaches/pagination/pagination";

import { fetchAllCoaches } from "../../../api/coaches/fetchall";
export default function CoachesPage() {
    const [coachesData, setCoachesData] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        try {
            async function fetchData() {
                const coachesData = await fetchAllCoaches();
                // console.log("Fetched coaches data:", coachesData);
                setCoachesData(coachesData);
            }
            fetchData();
        } catch (error) {
            console.error("Error fetching coaches data:", error);
        } finally {

            setLoading(false)
        }

    }, []);
    return (
        <div
            className="min-h-screen bg-neutral-50  p-8     shadow-2xl"    >
            <CoachPageHeader />

            <CoachToolbar />

            {loading ? (
                <CoachGridSkeleton />
            ) : coachesData.length === 0 ? (
                <EmptyCoachState />
            ) : (
                <>
                    <CoachGrid coaches={coachesData} />

                    {/* <CoachPagination
                    currentPage={1}
                    totalPages={5}
                    onPageChange={() => {}}
                    /> */}
                </>
            )}
        </div>
    )
}