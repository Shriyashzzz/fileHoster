import {
  Router,
  type Response,
  type Request,
  type NextFunction,
} from "express";
import { validationResult, matchedData, body } from "express-validator";
import authCheckerMiddleware from "../../middlewares/checkIfAuth.js";
import { supabase } from "./fileUploadRouter.js";
import queries from "../../models/queries.js";
const shareLinkRouter = Router({ mergeParams: true });

const validationMiddleware = [
  body("totSelect").custom((value) => {
    if (value == "1hr" || value == "12hr" || value == "24hr") {
      return true;
    } else {
      throw new Error("Invalid Time Out Select");
    }
  }),
];

shareLinkRouter.post(
  "/",
  authCheckerMiddleware,
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty())
      return res.send("Error:Incorrect Time Out Link Selection");

    const { totSelect } = matchedData(req);
    if (!(typeof req.params.fileId == "string"))
      return res.send("Invalid File Id");
    const intFileId = parseInt(req.params.fileId);

    let timeOutValue = 60 * 60; // 1min * 60 = 1 hour
    if (totSelect == "12hr") {
      timeOutValue = 12 * 60 * 60;
    } else if (totSelect == "24hr") {
      timeOutValue = 24 * 60 * 60;
    }

    const { file } = await queries.getThatFile(intFileId);
    if (!file) next(new Error("Failed fetching the metadata"));

    const { data, error } = await supabase.storage
      .from("clientFiles")
      .createSignedUrl(file!.path, timeOutValue);
    if (error) next(new Error("Failed fetching the signedUrl"));

    res.render("fileDetails.ejs", { fileLink: data?.signedUrl, file: file });
  },
);

export default shareLinkRouter;
