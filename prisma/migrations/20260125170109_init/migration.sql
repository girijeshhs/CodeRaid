-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('MEMBER', 'MODERATOR', 'OWNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "handle" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "lastSnapshotAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetCodeSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "takenFor" TIMESTAMP(3) NOT NULL,
    "total" INTEGER NOT NULL,
    "easy" INTEGER NOT NULL,
    "medium" INTEGER NOT NULL,
    "hard" INTEGER NOT NULL,
    "topics" JSONB,
    "contests" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeetCodeSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DerivedProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "totalDelta" INTEGER NOT NULL,
    "easyDelta" INTEGER NOT NULL,
    "mediumDelta" INTEGER NOT NULL,
    "hardDelta" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "streakAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DerivedProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inviteCode" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyMembership" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");

-- CreateIndex
CREATE INDEX "LeetCodeSnapshot_takenFor_idx" ON "LeetCodeSnapshot"("takenFor");

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeSnapshot_userId_takenFor_key" ON "LeetCodeSnapshot"("userId", "takenFor");

-- CreateIndex
CREATE UNIQUE INDEX "DerivedProgress_snapshotId_key" ON "DerivedProgress"("snapshotId");

-- CreateIndex
CREATE INDEX "DerivedProgress_day_idx" ON "DerivedProgress"("day");

-- CreateIndex
CREATE UNIQUE INDEX "DerivedProgress_userId_day_key" ON "DerivedProgress"("userId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Party_inviteCode_key" ON "Party"("inviteCode");

-- CreateIndex
CREATE INDEX "PartyMembership_userId_idx" ON "PartyMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PartyMembership_partyId_userId_key" ON "PartyMembership"("partyId", "userId");

-- AddForeignKey
ALTER TABLE "LeetCodeSnapshot" ADD CONSTRAINT "LeetCodeSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DerivedProgress" ADD CONSTRAINT "DerivedProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DerivedProgress" ADD CONSTRAINT "DerivedProgress_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "LeetCodeSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMembership" ADD CONSTRAINT "PartyMembership_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMembership" ADD CONSTRAINT "PartyMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
