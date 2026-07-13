/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indvFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "files";

-- DropTable
DROP TABLE "indvFile";

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndvFile" (
    "id" SERIAL NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT,
    "path" TEXT NOT NULL,
    "size" INTEGER,
    "mimetype" TEXT NOT NULL,
    "FolderId" INTEGER NOT NULL,

    CONSTRAINT "IndvFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_fileName_key" ON "Folder"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "IndvFile_fileName_key" ON "IndvFile"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "IndvFile_path_key" ON "IndvFile"("path");

-- AddForeignKey
ALTER TABLE "IndvFile" ADD CONSTRAINT "IndvFile_FolderId_fkey" FOREIGN KEY ("FolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
