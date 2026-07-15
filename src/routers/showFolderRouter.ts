import { Router, type Request, type Response } from "express";
import queries from "../models/queries";

const showFolderRouter = Router({ mergeParams: true });

showFolderRouter.get("/", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { folderId } = req.params;
    if (typeof folderId == "string") {
      const intFolderId = parseInt(folderId);
      if (!(await queries.checkIfFolderExists(intFolderId))) {
        res.status(404).send("Error: Folder Not Found  ");
      }
      if (!(await queries.checkIfFolderOwner(intFolderId, req.user.id))) {
        res.status(403).send("Error: You do not have access to this File ");
      }
      res.render("home.ejs", {
        folders: await queries.getFolders(req.user.id),
        files: await queries.getFolderFiles(intFolderId, req.user.id),
        universalId: folderId,
      });
    }
  } else {
    res.redirect("/login");
  }
});

export default showFolderRouter;
