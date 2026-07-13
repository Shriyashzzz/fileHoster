import { Router } from "express";
import type { Request, Response } from "express";

const homeRouter = Router();

homeRouter.get("/", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.render("home.ejs");
  } else {
    res.redirect("/login");
  }
});

export { homeRouter };
