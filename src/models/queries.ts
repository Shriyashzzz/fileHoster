import prisma from "../controllers/config/prisma";
import type { Folder, IndvFile } from "../generated/prisma/client";

interface retFolder {
  status: boolean;
  newFolder?: Folder;
}
interface retFile {
  status: boolean;
  file?: IndvFile;
}
class Queries {
  async getFolders(userId: number) {
    const folders = await prisma.folder.findMany({ where: { userId: userId } });
    return folders;
  }

  async getFolderFiles(folderId: number, userId: number) {
    const files = await prisma.indvFile.findMany({
      where: { folderId: folderId, userId: userId },
    });

    return files;
  }
  async getUniversalId(userId: number) {
    const firstId = await prisma.folder.findFirst({
      where: { userId: userId },
    });
    return firstId?.id;
  }
  async checkIfFolderExists(folderId: number): Promise<Boolean> {
    try {
      const folder = await prisma.folder.findUnique({
        where: {
          id: folderId,
        },
      });
      if (folder) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async makeNewFolder(folderName: string, userId: number): Promise<retFolder> {
    try {
      const newFolder = await prisma.folder.create({
        data: { fileName: folderName, userId: userId },
      });
      return { status: true, newFolder: newFolder };
    } catch (e) {
      return {
        status: false,
      };
    }
  }

  async deleteFolder(folderId: number): Promise<Boolean> {
    try {
      const delComm = await prisma.folder.delete({
        where: {
          id: folderId,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async checkIfFolderOwner(folderId: number, userId: number): Promise<Boolean> {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: folderId, userId: userId },
      });
      if (folder) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  async checkIfFileOwner(fileId: number, userId: number): Promise<Boolean> {
    try {
      const folder = await prisma.indvFile.findUnique({
        where: { id: fileId, userId: userId },
      });
      if (folder) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async emailExists(email: string): Promise<Boolean> {
    try {
      const user = await prisma.users.findUnique({ where: { email: email } });
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  async usernameExists(username: string): Promise<Boolean> {
    try {
      const user = await prisma.users.findUnique({
        where: { username: username },
      });
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  async getThatFile(fileId: number): Promise<retFile> {
    try {
      const file = await prisma.indvFile.findUnique({ where: { id: fileId } });
      if (file) {
        return { status: true, file: file };
      } else {
        return { status: false };
      }
    } catch (e) {
      return { status: false };
    }
  }
  async renameFile(fileId: number, newName: string): Promise<Boolean> {
    try {
      const file = await prisma.indvFile.update({
        where: { id: fileId },
        data: { fileName: newName },
      });
      if (file) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async deleteFile(fileId: number): Promise<Boolean> {
    try {
      const file = await prisma.indvFile.delete({
        where: { id: fileId },
      });
      if (file) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

const queries = new Queries();
export default queries;
