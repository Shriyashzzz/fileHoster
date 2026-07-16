import { Router } from "express";
import type { Request, Response } from "express";
import prisma from "../../controllers/config/prisma.js";
import passport from "passport";
const loginRouter = Router();

loginRouter.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  } else {
    return res.render("login.ejs");
  }
});

loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);
export default loginRouter;
