import type { Request, Response, Errback, NextFunction } from "express";
import express from "express";
import config from "./controllers/config/config";
import session from "express-session";
import path from "node:path";
import passport from "passport";
import { homeRouter } from "./routers/homeRouter";
import { deserializer, handleLogOut, localStrat, serializer } from "./auth";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./controllers/config/prisma";
import loginRouter from "./routers/loginRouter";
import signUpRouter from "./routers/signUpRouter";
import fileUploadRouter from "./routers/fileUploadRouter";
import fileRouter from "./routers/fileRouter";
import newFolderRouter from "./routers/newFolderRouter";
import deleteFolderRouter from "./routers/deleteFolderRouter";
import showFolderRouter from "./routers/showFolderRouter";
import flash from "connect-flash";
import fileDetailsRouter from "./routers/getFIleDetails";
export const app = express();
// express session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kitty",
    resave: false,
    saveUninitialized: false,
    // store for persistace of session storage
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: config.nodeEnv == "PROD" ? true : false,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 60 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
    }),
  }),
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
// passport stuff for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrat);
passport.serializeUser(serializer as any);
passport.deserializeUser(deserializer as any);
// connect flash used ot show error messages during authentication
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = req.flash("error");
  res.locals.signInError = error;
  next();
});
// routes
app.use("/login", loginRouter);
app.use("/signup", signUpRouter);
app.use("/", homeRouter);
app.use("/fileUpload/:folderId", fileUploadRouter);
app.use("/showFolder/:folderId", showFolderRouter);
app.use("/getFiles/:folderId", fileRouter);
app.use("/newFolder", newFolderRouter);
app.use("/deleteFolder/:folderId", deleteFolderRouter);
app.use("/getDetails/:fileId", fileDetailsRouter);
app.get("/logout", handleLogOut);
// Error Handler for server errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.send("Server Error: Please Try Again Later");
});
app.listen(config.port, () => {
  console.log(`Live: http://localhost:${config.port}`);
});
