import { db } from "../../db/kysely/kysely.js";

type RegistrationData = {
    Name: string;
    Email: string;
    PhoneNumber: string;
    Location: string;
    Profession: string;
};
export  async function registerforContest(req: any, res: any) {
    const {Name,Email,PhoneNumber,Location,Profession} = req.body;
    const user = req.user;
    // console.log("it is request for registering of user :", user);
    const { ContestId } = req.params;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    let contestcreatorId :string | undefined = undefined;
    try{
        const contest = await db.selectFrom("Contest").where("Id","=",ContestId).selectAll().executeTakeFirst();
        contestcreatorId = contest?.CreatedById;
        if(!contestcreatorId){
            return res.status(404).json({message:"Contest not found"});
        }
        await db.insertInto("ContestRegistration").values({
            Id: crypto.randomUUID(),
            OrganizedById:contestcreatorId,
            RegisteredUserId: user.Id,
            RegisteredContestId: ContestId,
            RegistrationData: {
                Name,
                Email,
                PhoneNumber,
                Location,
                Profession
            },
            CreatedAt: new Date()
        }).executeTakeFirst();
        return res.json({message:"Registered for contest successfully"});

    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}