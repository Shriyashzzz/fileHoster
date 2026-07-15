import { Router } from "express";
import type { Request, Response } from "express";
import queries from "../../models/queries";

const fileRouter = Router({ mergeParams: true });

fileRouter.get(
  "/",
  async (req: Request<{ folderId: string }>, res: Response) => {
    if (req.isAuthenticated()) {
      const { folderId } = req.params;

      if (!folderId) {
        return res.sendStatus(500);
      }
      const intFolderId = parseInt(folderId);
      if (await queries.checkIfFolderExists(intFolderId)) {
        const files = await queries.getFolderFiles(
          parseInt(folderId),
          req.user.id,
        );
        res.locals.universalId = intFolderId;
        res.json({
          status: 200,
          redirectUrl: `/showFolder/${res.locals.universalId}`,
        });
      } else {
        res.sendStatus(400);
      }
    } else {
      res.redirect("/login");
    }
  },
);

export default fileRouter;
