import { Router } from "express";
import type { Request, Response } from "express";
import queries from "../models/queries";
import createUniversalFolder from "../utils/createUniversalFolder";
const homeRouter = Router();

homeRouter.get("/", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const universalId = await queries.getUniversalId();
    if (!universalId) {
      const newUniId = await createUniversalFolder(req);
      if (!newUniId) console.log("failed making new universal folder ");
      res.render("home.ejs", {
        folders: await queries.getFolders(),
        files: await queries.getFolderFiles(newUniId!),
        universalId: newUniId,
      });
    } else {
      res.render("home.ejs", {
        folders: await queries.getFolders(),
        files: await queries.getFolderFiles(universalId),
        universalId: universalId,
      });
    }
  } else {
    res.redirect("/login");
  }
});

export { homeRouter };
