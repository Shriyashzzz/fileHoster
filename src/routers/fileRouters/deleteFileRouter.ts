import { Router, type Request, type Response } from "express";
import queries from "../../models/queries";
import { supabase } from "./fileUploadRouter";
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
        const { file } = await queries.getThatFile(intFileId);
        const supaStatus = await supabase.storage
          .from("clientFiles")
          .remove([file!.path, file!.fileName]);
        if (supaStatus.error)
          return res.status(500).send("Error: Server Error!");
        const success = await queries.deleteFile(intFileId);
        if (success.status) {
          return res.redirect(`/showFolder/${success.file!.folderId}`);
        } else {
          console.log("error deleting file form the prisma db");
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
