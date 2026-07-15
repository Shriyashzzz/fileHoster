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
    if (await queries.checkIfFolderExists(intFolderId)) {
      const files = await queries.getFolderFiles(parseInt(folderId));

      res.locals.universalId = intFolderId;
      console.log("at filerouter", res.locals.universalId);
      res.json({
        status: 200,
        redirectUrl: `/showFolder/${res.locals.universalId}`,
      });
    } else {
      res.sendStatus(400);
    }
  },
);

export default fileRouter;
