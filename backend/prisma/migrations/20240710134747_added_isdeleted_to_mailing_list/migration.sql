-- AlterTable
ALTER TABLE "MailingList" ADD COLUMN     "isDeleted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
