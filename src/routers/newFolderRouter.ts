import { Router, type Request, type Response } from "express";
import queries from "../models/queries";
import { upload } from "./fileUploadRouter";
const newFolderRouter = Router({ mergeParams: true });

newFolderRouter.post(
  "/",
  upload.none(),
  async (req: Request, res: Response) => {
    const { folderName } = req.body;
    console.log(folderName);
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      const query = await queries.makeNewFolder(folderName, userId);
      if (query.status == true && query.newFolder) {
        res.locals.universalId = query.newFolder.id;
        res.json({ status: 200, redirectUrl: "/" });
      } else {
        res.json({ status: 500, message: "Internal Server Error" });
      }
    } else {
      res.status(401).redirect("/login");
    }
  },
);

export default newFolderRouter;
