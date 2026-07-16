/*
  Warnings:

  - Added the required column `publicUrl` to the `IndvFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IndvFile" ADD COLUMN     "publicUrl" TEXT NOT NULL;
