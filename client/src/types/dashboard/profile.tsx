// select(["Id","GlobalRank","Location","TotalActivities","TotalContestsParticipated","TotalContestsWon","TotalPoints","TotalXP"]).where("UserId", "=", userId).execute();
export type ProfileData = {
    Id: string;
    GlobalRank: number;
    Location: string;
    TotalActivities: number;
    TotalContestsParticipated: number;
    TotalContestsWon: number;
    TotalPoints: number;
    TotalXP: number;
}