import { db } from "../../db/kysely/kysely.js";
export default async function getRegistrationsForContest(req: any, res: any) {
    const contestId = req.params.ContestId;
    // console.log("Fetching registrations for contest ID:", contestId);
    try {
        const registrations = await db.selectFrom("ContestRegistration")
            .selectAll()
            .where("RegisteredContestId", "=", contestId)
            .execute();
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}