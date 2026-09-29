import {db} from "../../db/kysely/kysely.js";
export async function getContestById(id: string) {
    return await db
        .selectFrom("Contest")
        .selectAll()
        .where("Id", "=", id)
        .executeTakeFirst();
}