type User = {
    Id: string;
    Role: string;
};

type Contest= {
    Id: string
    Title: string
    Description: string
    Mode: string
    Fee: string
    ParticipationType: string
    TeamSize?: string
    Category?: string
    RegistrationStartDate: Date
    RegistrationEndDate: Date
    EventStartDate: Date
    EventEndDate?: Date
    Website?: string
    Location?: string
    OrganizationId?: string
    OrganizedBy: string
    CreatedById: string
    CreatedAt?: Date
    UpdatedAt?: Date

  }

export function canEditContest(
    user: User,
    contest: Contest
) {
    if (user.Role === "ADMIN") {
        return true;
    }

    return (
        user.Role === "ORGANIZATION" &&
        contest.CreatedById === user.Id
    );
}