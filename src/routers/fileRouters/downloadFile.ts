import { Router, type Request, type Response } from "express";
import queries from "../../models/queries.js";
import { supabase } from "./fileUploadRouter.js";
const downloadFileRouter = Router({ mergeParams: true });

downloadFileRouter.get("/", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) return res.status(401).redirect("/login");

  if (req.params.fileId && typeof req.params.fileId == "string") {
    const intfileId = parseInt(req.params.fileId);

    const { file } = await queries.getThatFile(intfileId);
    if (!file) return res.status(404).send("404: File not Found");
    const { data, error } = await supabase.storage
      .from("clientFiles")
      .download(file.path);
    if (error)
      return res.status(500).send("500: Error downloading files! try again");
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", data.type);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.fileName}"`,
    );
    res.send(buffer);
  }
});

export default downloadFileRouter;
