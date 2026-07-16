import { Router, type Request, type Response } from "express";
import queries from "../../models/queries";

const renameFileRouter = Router({ mergeParams: true });
// make sure to validate incoming fileName later
renameFileRouter.post("/", async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { fileName } = req.body;
  console.log(fileName);
  if (req.isAuthenticated()) {
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
        return res.send("Error: You are unauthorized to perform this action!");
      }
    }
  } else {
    return res.redirect("/login");
  }
});

export default renameFileRouter;
