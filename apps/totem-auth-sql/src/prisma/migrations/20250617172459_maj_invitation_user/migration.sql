/*
  Warnings:

  - Added the required column `invitedBy` to the `InvitationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usedAt` to the `InvitationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvitationToken" ADD COLUMN     "invitedBy" TEXT NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tempPassword" TEXT;
