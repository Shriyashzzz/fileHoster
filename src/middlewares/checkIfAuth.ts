import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const authCheckerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export default authCheckerMiddleware;
