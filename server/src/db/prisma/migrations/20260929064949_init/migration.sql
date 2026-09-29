-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'COACH', 'PLAYER', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SubmittedStatus" AS ENUM ('SUBMITTED', 'NOTSUBMITTED');

-- CreateEnum
CREATE TYPE "AdminTaskStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SportCategory" AS ENUM ('PUSHUPS', 'RUNNING', 'SQUATS', 'BADMINTON', 'BASKETBALL', 'FOOTBALL', 'CRICKET', 'TUG_OF_WAR', 'WEIGHTLIFTING', 'YOGA', 'SWIMMING');

-- CreateEnum
CREATE TYPE "ContestFee" AS ENUM ('Paid', 'Free');

-- CreateEnum
CREATE TYPE "ContestMode" AS ENUM ('Online', 'Offline', 'Hybrid');

-- CreateEnum
CREATE TYPE "ActivityView" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "CoachProfileView" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ContestParticipationType" AS ENUM ('Individual', 'Team');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('Available', 'SoldOut');

-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VideoUploadStatus" AS ENUM ('EMPTY', 'PENDING', 'UPLOADED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "OrganizationId" TEXT,
    "Username" TEXT NOT NULL,
    "OAuthUsernames" TEXT,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),
    "FollowingCoaches" INTEGER NOT NULL DEFAULT 0,
    "AccessibleRoles" TEXT[] DEFAULT ARRAY['PLAYER']::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "Id" TEXT NOT NULL,
    "AppliedBy" TEXT DEFAULT '',
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "OrganizationName" TEXT NOT NULL,
    "Website" TEXT,
    "Description" TEXT NOT NULL,
    "VerificationDoc" TEXT NOT NULL,
    "Status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Role" "Role" NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "RegistrationStartDate" TIMESTAMP(3) NOT NULL,
    "RegistrationEndDate" TIMESTAMP(3) NOT NULL,
    "EventStartDate" TIMESTAMP(3) NOT NULL,
    "EventEndDate" TIMESTAMP(3),
    "Website" TEXT,
    "OrganizedBy" TEXT NOT NULL,
    "CreatedById" TEXT NOT NULL,
    "OrganizationId" TEXT,
    "Mode" "ContestMode" NOT NULL,
    "Location" TEXT,
    "Fee" INTEGER NOT NULL,
    "Category" "SportCategory",
    "ParticipationType" "ContestParticipationType" NOT NULL DEFAULT 'Individual',
    "TeamSize" INTEGER,
    "Status" "ContestStatus" NOT NULL DEFAULT 'UPCOMING',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ContestRegistration" (
    "Id" TEXT NOT NULL,
    "RegisteredUserId" TEXT NOT NULL,
    "RegisteredContestId" TEXT NOT NULL,
    "OrganizedById" TEXT,
    "RegistrationData" JSONB NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestRegistration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Store" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "ImageUrl" TEXT NOT NULL,
    "ContactInfo" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL DEFAULT 1,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT NOT NULL,
    "Status" "ItemStatus" NOT NULL DEFAULT 'Available',
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Store_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "Id" TEXT NOT NULL,
    "ItemId" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "Id" TEXT NOT NULL,
    "CurrentStreak" INTEGER NOT NULL DEFAULT 0,
    "LongestStreak" INTEGER NOT NULL DEFAULT 0,
    "LastUploadDate" TIMESTAMP(3),
    "UpdatedAt" TIMESTAMP(3),
    "CreatedBy" TEXT NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Points" INTEGER NOT NULL,
    "Status" "AdminTaskStatus" NOT NULL DEFAULT 'ACTIVE',
    "CompletedBy" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserTask" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "TaskId" TEXT,
    "VideoUrl" TEXT,
    "VideourlStatus" "VideoUploadStatus" NOT NULL DEFAULT 'EMPTY',
    "Description" TEXT NOT NULL DEFAULT '',
    "TaskStatus" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "SubmissionStatus" "SubmittedStatus" NOT NULL DEFAULT 'NOTSUBMITTED',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "UserTask_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "XP" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "IncrementBy" TEXT NOT NULL,
    "SportsCategory" TEXT NOT NULL DEFAULT 'AllSports',
    "TotalXP" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "XP_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "VideoUrl" TEXT NOT NULL,
    "PublicId" TEXT NOT NULL,
    "Duration" DOUBLE PRECISION NOT NULL,
    "Title" TEXT,
    "Description" TEXT,
    "View" "ActivityView" NOT NULL DEFAULT 'PRIVATE',
    "Category" TEXT NOT NULL DEFAULT '',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ActivityReport" (
    "Id" TEXT NOT NULL,
    "ActivityId" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "AnalysisJson" JSONB NOT NULL,
    "ReportJson" JSONB NOT NULL,
    "SummaryText" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "ActivityReport_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "DisplayName" TEXT,
    "Headline" TEXT,
    "Bio" TEXT,
    "About" TEXT,
    "AvatarUrl" TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    "BannerUrl" TEXT DEFAULT 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80',
    "Location" TEXT,
    "GlobalRank" INTEGER DEFAULT 0,
    "TotalXP" INTEGER DEFAULT 0,
    "TotalPoints" INTEGER DEFAULT 0,
    "TotalActivities" INTEGER DEFAULT 0,
    "TotalContestsParticipated" INTEGER DEFAULT 0,
    "TotalContestsWon" INTEGER DEFAULT 0,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "ImageUrls" JSONB,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "IssuedBy" TEXT,
    "IssuedDate" TIMESTAMP(3),
    "ImageUrl" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "Id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "Platform" TEXT NOT NULL,
    "Url" TEXT NOT NULL,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Coach" (
    "Id" TEXT NOT NULL,
    "AppliedBy" TEXT NOT NULL,
    "CoachName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Description" TEXT,
    "VerificationDoc" TEXT NOT NULL,
    "Status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CoachProfile" (
    "Id" TEXT NOT NULL,
    "CoachId" TEXT NOT NULL,
    "CoachName" TEXT NOT NULL,
    "Bio" TEXT,
    "AvatarUrl" TEXT DEFAULT 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    "Description" TEXT,
    "Experience" TEXT,
    "View" "CoachProfileView" DEFAULT 'PRIVATE',
    "Certifications" TEXT,
    "Followers" INTEGER NOT NULL DEFAULT 0,
    "Location" TEXT,
    "BannerUrl" TEXT DEFAULT 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80',
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "CoachProfile_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CoachContacts" (
    "Id" TEXT NOT NULL,
    "CoachId" TEXT NOT NULL,
    "Label" TEXT NOT NULL,
    "Value" TEXT NOT NULL,

    CONSTRAINT "CoachContacts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CoachSocialLinks" (
    "Id" TEXT NOT NULL,
    "CoachId" TEXT NOT NULL,
    "Platform" TEXT NOT NULL,
    "Url" TEXT NOT NULL,
    "Tag" TEXT DEFAULT 'Link',

    CONSTRAINT "CoachSocialLinks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CoachSpecialization" (
    "Id" TEXT NOT NULL,
    "CoachId" TEXT NOT NULL,
    "Specialization" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "CoachSpecialization_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "Id" TEXT NOT NULL,
    "ReceiverId" TEXT NOT NULL,
    "SenderId" TEXT,
    "Title" TEXT NOT NULL DEFAULT 'Greetings from Athlantics',
    "Message" TEXT NOT NULL DEFAULT 'Thank you for being a part of our community! We appreciate your engagement and look forward to your continued participation.',
    "IsRead" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "Id" TEXT NOT NULL,
    "Feedback" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Following" (
    "Id" TEXT NOT NULL,
    "FollowerId" TEXT NOT NULL,
    "FollowingId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Username_key" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Username_key" ON "Organization"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Email_key" ON "Organization"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_CreatedBy_key" ON "Streak"("CreatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "UserTask_UserId_TaskId_key" ON "UserTask"("UserId", "TaskId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityReport_ActivityId_key" ON "ActivityReport"("ActivityId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_UserId_key" ON "Profile"("UserId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_Email_key" ON "Coach"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "CoachProfile_CoachId_key" ON "CoachProfile"("CoachId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_OrganizationId_fkey" FOREIGN KEY ("OrganizationId") REFERENCES "Organization"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestRegistration" ADD CONSTRAINT "ContestRegistration_RegisteredUserId_fkey" FOREIGN KEY ("RegisteredUserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestRegistration" ADD CONSTRAINT "ContestRegistration_RegisteredContestId_fkey" FOREIGN KEY ("RegisteredContestId") REFERENCES "Contest"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ItemId_fkey" FOREIGN KEY ("ItemId") REFERENCES "Store"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XP" ADD CONSTRAINT "XP_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityReport" ADD CONSTRAINT "ActivityReport_ActivityId_fkey" FOREIGN KEY ("ActivityId") REFERENCES "Activity"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityReport" ADD CONSTRAINT "ActivityReport_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachProfile" ADD CONSTRAINT "CoachProfile_CoachId_fkey" FOREIGN KEY ("CoachId") REFERENCES "Coach"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachContacts" ADD CONSTRAINT "CoachContacts_CoachId_fkey" FOREIGN KEY ("CoachId") REFERENCES "CoachProfile"("CoachId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachSocialLinks" ADD CONSTRAINT "CoachSocialLinks_CoachId_fkey" FOREIGN KEY ("CoachId") REFERENCES "CoachProfile"("CoachId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachSpecialization" ADD CONSTRAINT "CoachSpecialization_CoachId_fkey" FOREIGN KEY ("CoachId") REFERENCES "CoachProfile"("CoachId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_ReceiverId_fkey" FOREIGN KEY ("ReceiverId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
