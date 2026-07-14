import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
export const upload = multer({ dest: "uploads/" });
import prisma from "../controllers/config/prisma";
import authCheckerMiddleware from "../middlewares/checkIfAuth";
const fileUploadRouter = Router({ mergeParams: true });
fileUploadRouter.post(
  "/",
  authCheckerMiddleware,
  upload.single("givenFile"),
  async (
    req: Request<{ folderId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    const { folderId } = req.params;
    const id = parseInt(folderId);
    if (req.file) {
      try {
        await prisma.indvFile.create({
          data: {
            fileName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            folderId: id,
            userId: req.user.id,
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
