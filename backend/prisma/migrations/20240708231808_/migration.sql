-- DropForeignKey
ALTER TABLE "RecipientToMailingList" DROP CONSTRAINT "RecipientToMailingList_mailingListId_fkey";

-- AddForeignKey
ALTER TABLE "RecipientToMailingList" ADD CONSTRAINT "RecipientToMailingList_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
