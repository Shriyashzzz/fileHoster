import queries from "../models/queries.js";
import prisma from "../controllers/config/prisma.js";
import type { Request } from "express";
const createUniversalFolder = async (
  req: Request,
): Promise<number | undefined> => {
  if (req.user) {
    const uniFolder = await prisma.folder.create({
      data: {
        fileName: "Root",
        userId: req.user.id,
      },
    });
    return uniFolder.id;
  } else {
    return;
  }
};

export default createUniversalFolder;
