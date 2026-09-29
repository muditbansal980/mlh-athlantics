import type { Request, Response } from 'express';
import { db } from "../../db/kysely/kysely.js";

async function addcontest(req: Request, res: Response) {
    const { Title, Description, Category, RegistrationStartDate, RegistrationEndDate, Location, Participationtype, TeamSize, Mode, Fee, EventStartDate, EventEndDate, Website } = req.body;
    const user = req.user; // Assuming authMiddleware has added the user info to the request object
    if (!user) {
        return res.status(401).json({ error: "Unauthenticated" });
    }
    let organizationId: string | undefined = undefined;
    try {
        if (user.Role === "ORGANIZATION") {
            const organization = await db
                .selectFrom("Organization")
                .select("Id")
                .where("AppliedBy", "=", user.Id)
                .executeTakeFirst();
            if (!organization) {
                return res.status(403).json({ error: "Organization not found for the user" });
            }
            organizationId = organization.Id;
        }
        await db.insertInto("Contest").values({
            Id: crypto.randomUUID(),
            Title: Title,
            Description: Description,
            Category: Category,
            RegistrationStartDate: RegistrationStartDate,
            ParticipationType: Participationtype,
            RegistrationEndDate: RegistrationEndDate,
            EventStartDate: EventStartDate,
            EventEndDate: EventEndDate || null,
            Location: Location || "Online",
            TeamSize: TeamSize || null,
            Website: Website || null,
            OrganizedBy: user.Role,
            OrganizationId: organizationId , // Only set OrganizationId if the user is an organization""),
            CreatedById: user.Id, // here we have taken general case that the user is either admin or organization, if you want to handle other cases, you can add more conditions
            Mode: Mode,
            Fee: Fee
        }).executeTakeFirst();
        // // console.log("Contest added successfully with this data:", {
        //     Title,
        //     Description,
        //     Category,
        //     RegistrationStartDate,
        //     RegistrationEndDate,
        //     Location,
        //     Participationtype,
        //     TeamSize,
        //     Mode,
        //     Fee,
        //     EventStartDate,
        //     EventEndDate,
        //     Website,
        //     OrganizedBy: user.Role,
        //     OrganizationId: organizationId,
        //     CreatedById: user.Id
        // });
        res.json({ message: "Contest added successfully" });

    } catch (error) {
        console.error('Error adding contest:', error);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}
export default addcontest;