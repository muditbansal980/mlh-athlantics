export interface Coach {
  Id       : string
  CoachName: string
  CoachId  : string
  View:string
  Bio?     : string
  AvatarUrl?  : string
  Experience?: string
  Certifications?: string
  Followers?: number
  BannerUrl?: string
  Location?: string
  Description?: string
  CreatedAt: Date
  UpdatedAt?: Date
}