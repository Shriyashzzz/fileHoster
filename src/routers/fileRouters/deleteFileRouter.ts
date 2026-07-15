import { Router, type Request, type Response } from "express";
import queries from "../../models/queries";

const deleteFileRouter = Router({ mergeParams: true });
deleteFileRouter.get("/", async (req: Request, res: Response) => {
  const { fileId } = req.params;
  if (req.isAuthenticated()) {
    if (typeof fileId == "string") {
      const intFileId = parseInt(fileId);
      const isValidOwner = await queries.checkIfFileOwner(
        intFileId,
        req.user.id,
      );
      if (isValidOwner) {
        const success = await queries.deleteFile(intFileId);
        if (success) {
          return res.redirect("/");
        }
      } else {
        return res.send("Error: You are unauthorized to perform this action!");
      }
    }
  } else {
    return res.redirect("/login");
  }
});

export default deleteFileRouter;
