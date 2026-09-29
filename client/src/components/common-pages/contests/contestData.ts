export type Contest = {
  Id: string;
  Title: string;
  Description: string;
  CreatedAt: string;
  Category: string;
  Location: string;
  Mode: "Online" | "Offline" | "Hybrid";
  ParticipationType: "Individual" | "Team";
  TeamSize: number;
  EventStartDate: string;
  EventEndDate: string;
  RegistrationStartDate: string;
  RegistrationEndDate: string;
  Website: string | null;
  Fee: number;
};

// ── Replace this with your real API response ───────────────────────────────
export const MOCK_CONTEST: Contest = {
  Id: "contest-001",
  Title: "City Sprint Challenge 2025",
  Description:
    "The City Sprint Challenge is an annual athletics competition open to runners of all skill levels. Compete across 5K, 10K, and half-marathon categories on a scenic city route. All finishers receive medals and the top 3 in each category receive cash prizes and trophies. This event is officially timed and results will be published on the national athletics portal.",
  CreatedAt: "2025-04-01T10:00:00.000Z",
  Category: "Athletics",
  Location: "Jawaharlal Nehru Stadium, New Delhi",
  Mode: "Offline",
  ParticipationType: "Individual",
  TeamSize: 1,
  EventStartDate: "2025-07-15T06:00:00.000Z",
  EventEndDate: "2025-07-15T14:00:00.000Z",
  RegistrationStartDate: "2025-05-01T00:00:00.000Z",
  RegistrationEndDate: "2025-07-01T23:59:00.000Z",
  Website: "https://citysprint2025.in",
  Fee: 499,
};
