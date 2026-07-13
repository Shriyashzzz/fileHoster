import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
export const upload = multer({ dest: "uploads/" });
import prisma from "../config/prisma";

const fileUploadRouter = Router();
fileUploadRouter.post(
  "/",
  upload.single("givenFile"),
  async (req: Request, res: Response, next: NextFunction) => {
    const { folderId } = req.body || 1;

    console.log(req.file);
    if (req.file) {
      try {
        await prisma.indvFile.create({
          data: {
            fileName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            FolderId: folderId,
          },
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    }
  },
);

export default fileUploadRouter;
