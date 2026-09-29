import { db } from "../../db/kysely/kysely.js";
export async function getallcontests(){
    return await db.selectFrom("Contest").selectAll().execute();
}