/*
  Warnings:

  - You are about to drop the column `FolderId` on the `IndvFile` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderId` to the `IndvFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `IndvFile` table without a default value. This is not possible if the table is not empty.
  - Made the column `fileName` on table `IndvFile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `IndvFile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "IndvFile" DROP CONSTRAINT "IndvFile_FolderId_fkey";

-- DropIndex
DROP INDEX "Folder_fileName_key";

-- DropIndex
DROP INDEX "IndvFile_fileName_key";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IndvFile" DROP COLUMN "FolderId",
ADD COLUMN     "folderId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "fileName" SET NOT NULL,
ALTER COLUMN "size" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndvFile" ADD CONSTRAINT "IndvFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndvFile" ADD CONSTRAINT "IndvFile_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
