import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import prisma from "../../controllers/config/prisma";
import authCheckerMiddleware from "../../middlewares/checkIfAuth";
import { createClient } from "@supabase/supabase-js";
import config from "../../controllers/config/config";
// what is an multer ?
// => node.js middleware for handling multipart/form-data
// text goes to req.body and multipart goed to either req.file || re.files depending if it's one upload or multiple uploads

//temporary memory to store file while uploading to supabase
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
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
  async (
    req: Request<{ folderId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) return res.status(401).send("Not authenticated");
    const { folderId } = req.params;
    const intFolderId = parseInt(folderId);
    // make sure to validate the file size before uploading
    if (req.file) {
      //builds a unique filename so two people uploading photo.jpg don't overwrite each other.
      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      //to ensure two fileNames do not clash in the supabase database
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      // uploads is the supabase bucket i'll be uploading this file to
      const filePath = `uploads/${fileName}`;
      // actually uploading the file to the database
      const { data, error } = await supabase.storage
        .from("clientFiles")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      if (error) {
        console.log("SUPABASE UPLOAD ERROR:", JSON.stringify(error, null, 2));
        //send error if could not upload to the supabase
        return res.sendStatus(500);
      } else {
        //if no error
        //upload to the prisma IndvFile Table
        const indvFile = await prisma.indvFile.create({
          data: {
            fileName: req.file.originalname,
            path: data.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            folderId: intFolderId,
            userId: req.user.id,
          },
        });
      }
      // set the current selected folder to the folder the new file has been uploaded to
      res.locals.universalId = intFolderId;
      return res.status(200).json({ redirectUrl: `/showFolder/${folderId}` });
    } else {
      //error message if no file was sent to the routes
      return res.status(400).send("Error: No file Uploaded");
    }
  },
);

export default fileUploadRouter;
