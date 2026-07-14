import { Router } from "express";
import type { Request, Response } from "express";
import queries from "../models/queries";

const fileRouter = Router({ mergeParams: true });

fileRouter.get(
  "/",
  async (req: Request<{ folderId: string }>, res: Response) => {
    const { folderId } = req.params;

    if (!folderId) {
      return res.sendStatus(500);
    }
    const intFolderId = parseInt(folderId);
    const files = await queries.getFolderFiles(parseInt(folderId));
    res.render("home.ejs", {
      folders: await queries.getFolders(),
      files: await queries.getFolderFiles(intFolderId),
      universalId: intFolderId, // rn we are changing the universl folder id after user clicks on it
    });
  },
);

export default fileRouter;
