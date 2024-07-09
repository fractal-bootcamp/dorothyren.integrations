/*
  Warnings:

  - Added the required column `body` to the `EmailBlast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailBlast" ADD COLUMN     "body" TEXT NOT NULL;
