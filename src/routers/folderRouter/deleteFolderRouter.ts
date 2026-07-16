import { Router, type Request, type Response } from "express";
import queries from "../../models/queries.js";
import createUniversalFolder from "../../utils/createUniversalFolder.js";
const deleteFolderRouter = Router({ mergeParams: true });

deleteFolderRouter.delete(
  "/",
  async (req: Request<{ folderId: string }>, res: Response) => {
    if (req.isAuthenticated()) {
      const { folderId } = req.params;

      const intFolderId = parseInt(folderId);
      const isDeleted = await queries.deleteFolder(intFolderId);
      console.log(isDeleted);
      if (isDeleted == true) {
        res.json({ status: 200, redirectUrl: "/" });
      }
    } else {
      res.json({ status: 401, redirectUrl: "/login" });
    }
  },
);

export default deleteFolderRouter;
