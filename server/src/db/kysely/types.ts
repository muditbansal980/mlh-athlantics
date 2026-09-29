
import { JsonValue } from '@prisma/client/runtime/client'
import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from 'kysely'

export interface Database {
  User: {
    Id: string
    Username: string
    OAuthUsernames?: string
    Email: string
    Password: string
    Role: string
    AccessibleRoles?: string[]
    OrganizationId?: string
    CreatedAt?: Date
    // UpdatedAt?: Generated<string>
  }
  Organization: {
    Id: string,
    AppliedBy: string,
    Username: string
    OrganizationName: string
    Website?: string
    Description: string
    VerificationDoc: string
    Status: string,
    Role: string,
    Email: string
  }
  Contest: {
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
  Store: {
    Id: String
    Name: String
    Description: String
    Price: Number
    ImageUrl: String
    ContactInfo: String
    Location: String
    Quantity: Number
    CreatedAt: Date
    CreatedBy: String
    Status: String
    Category: String
    UpdatedAt?: Date
  }
  Activity: {
    Id: String
    VideoUrl: String
    Title?: String
    Description?: String
    PublicId: String
    View: String
    Duration: number
    Category?: String
    CreatedAt: Date
    UserId: String
    UpdatedAt?: Date
  }
  ActivityReport: {
    Id: string
    ActivityId: string
    UserId: string
    Status: string
    AnalysisJson: JsonValue
    ReportJson: JsonValue
    SummaryText: string
    CreatedAt: Date
    UpdatedAt?: Date
  }
  Streak: {
    Id: String
    CurrentStreak: number
    LongestStreak?: number
    LastUploadDate?: Date
    CreatedBy: String
    UpdatedAt?: Date
  }
  Cart: {
    Id: String
    UserId: String
    ItemId: String
    Quantity: number
  }
  Tasks: {
    Id: string
    Title: string
    Description: string
    Points: number
    Status: string
    CompletedBy: number
    CreatedAt: Date
  }
  UserTask: {
    Id: string
    UserId: string
    TaskId?: string
    VideoUrl?: string
    VideourlStatus?: string
    Description?: string
    SubmissionStatus?: string
    TaskStatus?: string
    CreatedAt: Date
    UpdatedAt?: Date
  }
  XP: {
    Id: string
    UserId: string
    IncrementBy: string
    TotalXP: number
    SportsCategory: string
    CreatedAt: Date
    UpdatedAt?: Date
  }
  ContestRegistration: {
    Id: string
    RegisteredUserId: string
    RegisteredContestId: string
    OrganizedById?: string
    RegistrationData: JsonValue
    CreatedAt: Date
  }
  Profile: {
    Id: string
    UserId: string
    Bio?: string
    About?: string
    AvatarUrl?: string
    BannerUrl?: string
    Location?: string
    GlobalRank?: number // this is the rank gained by global contests
    TotalXP?: number
    TotalPoints?: number
    TotalActivities?: number
    TotalContestsParticipated?: number
    TotalContestsWon?: number
    CreatedAt: Date
    UpdatedAt?: Date
  }
  Achievements: {
    Id: string
    UserId: string
    Title: string
    Description: string
    ImageUrls?: JsonValue
    CreatedAt: Date
    UpdatedAt?: Date
  }
  Certificate: {
    Id: string
    UserId: string
    Title: string
    Description: string
    IssuedBy: string
    IssuedDate: Date
    ImageUrl?: string
    CreatedAt: Date
    UpdatedAt?: Date
  }
  SocialLinks: {
    Id: String
    UserId: String
    Platform: String
    Url: String
  }
  Coach: {
    Id: String
    CoachName: String
    AppliedBy: String             // User ID of the one who applied for coach registration
    Email: String
    VerificationDoc: String
    Description?: String
    Status: String
    CreatedAt: Date
  }
  Notifications: {
    Id: String
    ReceiverId: String
    SenderId?: String
    Title?: String
    Message?: String
    IsRead: boolean
    CreatedAt: Date
    UpdatedAt?: Date
  }
  CoachProfile:{
    Id: String
    CoachName: String
    CoachId: String
    Bio?: String
    AvatarUrl?:String
    View?: String
    Experience?: String
    Certifications?: String
    Followers?: number
    BannerUrl?: String
    Location?: String
    Description?: String
    CreatedAt: Date
    UpdatedAt?: Date
  }
  CoachSocialLinks:{
    Id: String
    CoachId: String
    Platform: String
    Url: String
    Tag?: String
  }
  CoachSpecialization:{
    Id: String
    CoachId: String
    Specialization: String
    CreatedAt: Date
    UpdatedAt?: Date
  }
  CoachContacts:{
    Id: String
    CoachId: String
    Label: String
    Value: String
  }
  Feedbacks: {
    Id: String
    Feedback: String
    CreatedAt: Date
  }
}
