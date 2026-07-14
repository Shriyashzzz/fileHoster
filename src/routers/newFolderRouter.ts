import { Router, type Request, type Response } from "express";
import queries from "../models/queries";

const newFolderRouter = Router();

newFolderRouter.post("/", async (req: Request, res: Response) => {
  const { folderName } = req.body;
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const newFolder = await queries.makeNewFolder(folderName, userId);
    res.status(200).render("home.ejs", {
      folders: await queries.getFolders(),
      files: await queries.getFolderFiles(newFolder.id),
      universalId: newFolder.id,
    });
  } else {
    res.status(401).redirect("/login");
  }
});

export default newFolderRouter;
