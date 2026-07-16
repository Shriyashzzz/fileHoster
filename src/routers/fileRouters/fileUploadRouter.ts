import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import prisma from "../../controllers/config/prisma";
import authCheckerMiddleware from "../../middlewares/checkIfAuth";
import { createClient } from "@supabase/supabase-js";
import config from "../../controllers/config/config";
import getFileMetaData from "../../utils/getFileMetaData";
import queries from "../../models/queries";
// what is an multer ?
// => node.js middleware for handling multipart/form-data
// text goes to req.body and multipart goed to either req.file || re.files depending if it's one upload or multiple uploads
//temporary memory to store file while uploading to supabase
const storage = multer.memoryStorage();
const maxSize = 10 * 1024 * 1024; // 10 * 1mb = 10mb
export const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPBASE_SERVICE_KEY,
);
const fileUploadRouter = Router({ mergeParams: true });
fileUploadRouter.post(
  "/",
  authCheckerMiddleware,
  upload.single("givenFile"),
  async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.params.folderId == "string") {
      const intFolderId = parseInt(req.params.folderId);
      if (!req.file) return res.status(400).send("Error: No file Uploaded");
      const { file, fileExt, fileName, filePath } = getFileMetaData(req.file);
      console.log(file);
      const { data, error } = await supabase.storage
        .from("clientFiles")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      if (error) return next(error);
      const response = await queries.uploadFileMetaData(
        file,
        data.path,
        intFolderId,
        req.user!.id,
      );
      if (!response) {
        await supabase.storage
          .from("clientFiles")
          .remove([file.path, fileName]);
        return next(
          new Error(
            "Error uploading file to the database. Please Try again later",
          ),
        );
      } else {
        res.locals.universalId = intFolderId;
        return res
          .status(200)
          .json({ redirectUrl: `/showFolder/${intFolderId}` });
      }
    }
  },
);
export default fileUploadRouter;
