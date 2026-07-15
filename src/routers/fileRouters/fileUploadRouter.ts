import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import prisma from "../../controllers/config/prisma";
import authCheckerMiddleware from "../../middlewares/checkIfAuth";
import queries from "../../models/queries";

// what is an multer ?
// => node.js middleware for handling multipart/form-data
// text goes to req.body and multipart goed to either req.file || re.files depending if it's one upload or multiple uploads
export const upload = multer({ dest: "uploads/" });
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
        const indvFile = await prisma.indvFile.create({
          data: {
            fileName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            folderId: id,
            userId: req.user.id,
          },
        });
        if (indvFile) {
          res.locals.universalId = id;
          return res
            .status(200)
            .json({ redirectUrl: `/showFolder/${folderId}` });
        }
      } catch (e) {
        console.log(e);
        return next(e);
      }
    }
  },
);

export default fileUploadRouter;
