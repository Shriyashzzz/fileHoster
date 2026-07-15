import { Router } from "express";
import type { Request, Response } from "express";
import queries from "../models/queries";
import createUniversalFolder from "../utils/createUniversalFolder";
const homeRouter = Router();

homeRouter.get("/", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    if (!res.locals.universalId) {
      const universalId = await queries.getUniversalId(req.user.id);
      if (!universalId) {
        const newUniId = await createUniversalFolder(req);
        if (!newUniId) console.log("failed making new universal folder ");
        res.locals.universalId = newUniId;
      } else {
        res.locals.universalId = universalId;
      }
    }
    res.status(200).render("home.ejs", {
      folders: await queries.getFolders(req.user.id),
      files: await queries.getFolderFiles(res.locals.universalId, req.user.id),
      universalId: res.locals.universalId,
    });
  } else {
    res.redirect("/login");
  }
});

export { homeRouter };
