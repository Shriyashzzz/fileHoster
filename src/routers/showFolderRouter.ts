import { Router, type Request, type Response } from "express";
import queries from "../models/queries";

const showFolderRouter = Router({ mergeParams: true });

showFolderRouter.get("/", async (req: Request, res: Response) => {
  const { folderId } = req.params;
  if (typeof folderId == "string") {
    const intFolderId = parseInt(folderId);
    res.render("home.ejs", {
      folders: await queries.getFolders(),
      files: await queries.getFolderFiles(intFolderId),
      universalId: folderId,
    });
  }
});

export default showFolderRouter;
