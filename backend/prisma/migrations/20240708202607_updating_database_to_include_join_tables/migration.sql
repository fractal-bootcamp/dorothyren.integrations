/*
  Warnings:

  - You are about to drop the column `mailingListId` on the `EmailBlast` table. All the data in the column will be lost.
  - You are about to drop the column `mailingListId` on the `Recipient` table. All the data in the column will be lost.
  - You are about to drop the column `messageId` on the `Recipient` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmailBlast" DROP CONSTRAINT "EmailBlast_mailingListId_fkey";

-- DropForeignKey
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_mailingListId_fkey";

-- DropForeignKey
ALTER TABLE "Recipient" DROP CONSTRAINT "Recipient_messageId_fkey";

-- AlterTable
ALTER TABLE "EmailBlast" DROP COLUMN "mailingListId";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "recipientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipient" DROP COLUMN "mailingListId",
DROP COLUMN "messageId";

-- CreateTable
CREATE TABLE "RecipientToMailingList" (
    "recipientId" TEXT NOT NULL,
    "mailingListId" TEXT NOT NULL,

    CONSTRAINT "RecipientToMailingList_pkey" PRIMARY KEY ("recipientId","mailingListId")
);

-- CreateTable
CREATE TABLE "EmailBlastToMailingList" (
    "emailBlastId" TEXT NOT NULL,
    "mailingListId" TEXT NOT NULL,

    CONSTRAINT "EmailBlastToMailingList_pkey" PRIMARY KEY ("emailBlastId","mailingListId")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientToMailingList" ADD CONSTRAINT "RecipientToMailingList_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientToMailingList" ADD CONSTRAINT "RecipientToMailingList_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailBlastToMailingList" ADD CONSTRAINT "EmailBlastToMailingList_emailBlastId_fkey" FOREIGN KEY ("emailBlastId") REFERENCES "EmailBlast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailBlastToMailingList" ADD CONSTRAINT "EmailBlastToMailingList_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
