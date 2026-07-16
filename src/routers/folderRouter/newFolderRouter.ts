import { Router, type Request, type Response } from "express";
import queries from "../../models/queries";
import { upload } from "../fileRouters/fileUploadRouter";
import { body, validationResult, matchedData } from "express-validator";

const validationMiddleware = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("Folder Name cannot be empty"),
];

const newFolderRouter = Router({ mergeParams: true });

newFolderRouter.post(
  "/",
  validationMiddleware,
  upload.none(),
  async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const error = validationResult(req);
      const userId = req.user.id;
      if (!error.isEmpty())
        return res.status(400).send("Folder Name cannot be empty luv");
      const { folderName } = matchedData(req);
      const query = await queries.makeNewFolder(folderName, userId);
      if (query.status == true && query.newFolder) {
        res.locals.universalId = query.newFolder.id;
        return res.json({ status: 200, redirectUrl: "/" });
      } else {
        return res.json({ status: 500, message: "Internal Server Error" });
      }
    } else {
      return res.status(401).redirect("/login");
    }
  },
);

export default newFolderRouter;
