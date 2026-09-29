import { getContestById } from "../../../repository/contest/getcontestbyId.js";
import { canEditContest } from "../../../policies/contest/authorization/contest.policy.js";

type User = {
    Id: string;
    Email: string;
    Username: string;
    Role: string;
}
export async function authorizeContestUpdate(
    contestId: string,
    user: User
) {
    const contest = await getContestById(contestId);

    if (!contest) {
        throw new Error("Contest not found");
    }

    if (!canEditContest(user, contest)) {
        throw new Error("Forbidden");
    }
}