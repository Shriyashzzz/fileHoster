import { Router } from "express";
import type { Request, Response } from "express";

const fileUploadRouter = Router();
fileUploadRouter.post("/", async (req: Request, res: Response) => {
  console.log(req.files);
});

export default fileUploadRouter;
