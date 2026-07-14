import prisma from "../controllers/config/prisma";
import type { Folder } from "../generated/prisma/client";
class Queries {
  async getFolders() {
    const folders = await prisma.folder.findMany();
    return folders;
  }

  async getAllFiles() {
    const files = await prisma.indvFile.findMany();
    return files;
  }
  async getFolderFiles(folderId: number) {
    const files = await prisma.indvFile.findMany({
      where: { folderId: folderId },
    });

    return files;
  }
  async getUniversalId() {
    const firstId = await prisma.folder.findFirst();
    return firstId?.id;
  }
  async checkIfFolderExists(folderId: number): Promise<Boolean> {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });
    if (folder) {
      return true;
    }
    return false;
  }

  async makeNewFolder(folderName: string, userId: number): Promise<Folder> {
    const newFolder = await prisma.folder.create({
      data: { fileName: folderName, userId: userId },
    });
    return newFolder;
  }
}

const queries = new Queries();
export default queries;
