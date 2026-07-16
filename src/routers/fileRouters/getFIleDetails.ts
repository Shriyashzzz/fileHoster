import { Router, type Response, type Request } from "express";
import queries from "../../models/queries.js";

const fileDetailsRouter = Router({ mergeParams: true });

fileDetailsRouter.get("/", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { fileId } = req.params;
    if (fileId && typeof fileId == "string") {
      const intfileId = parseInt(fileId);
      console.log(req.user.id);
      if (await queries.checkIfFileOwner(intfileId, req.user.id)) {
        const query = await queries.getThatFile(intfileId);
        if (query.status) {
          res.render("fileDetails.ejs", {
            file: query.file,
          });
        } else {
          res.status(404).send("The file you are lookling for does not exist!");
        }
      } else {
        res.status(403).send("Error: You do not have access to this File ");
      }
    }
  }
});

export default fileDetailsRouter;
