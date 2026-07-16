import { Router, type Request, type Response } from "express";
import queries from "../../models/queries.js";
import { validationResult, matchedData, body } from "express-validator";

const validationMiddleware = [
  body("fileName").trim().notEmpty().withMessage("FileName cannot be empty"),
];

const renameFileRouter = Router({ mergeParams: true });
renameFileRouter.post(
  "/",
  validationMiddleware,
  async (req: Request, res: Response) => {
    const { fileId } = req.params;
    if (req.isAuthenticated()) {
      const error = validationResult(req);
      if (!error.isEmpty()) return res.status(400).send(`${error}`);
      const { fileName } = matchedData(req);
      if (typeof fileId == "string") {
        const intFileId = parseInt(fileId);
        const isValidOwner = await queries.checkIfFileOwner(
          intFileId,
          req.user.id,
        );
        if (isValidOwner) {
          const success = await queries.renameFile(intFileId, fileName);
          if (success) {
            return res.redirect("/");
          }
        } else {
          return res.send(
            "Error: You are unauthorized to perform this action!",
          );
        }
      }
    } else {
      return res.redirect("/login");
    }
  },
);

export default renameFileRouter;
