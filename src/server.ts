import type { Request, Response, NextFunction } from "express";
import express from "express";
import config from "./controllers/config/config.js";
import session from "express-session";
import path from "node:path";
import passport from "passport";
import { homeRouter } from "./routers/homeRouter.js";
import { deserializer, handleLogOut, localStrat, serializer } from "./auth.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./controllers/config/prisma.js";
import loginRouter from "./routers/authRouters/loginRouter.js";
import signUpRouter from "./routers/authRouters/signUpRouter.js";
import fileUploadRouter from "./routers/fileRouters/fileUploadRouter.js";
import fileRouter from "./routers/folderRouter/fileRouter.js";
import newFolderRouter from "./routers/folderRouter/newFolderRouter.js";
import deleteFolderRouter from "./routers/folderRouter/deleteFolderRouter.js";
import showFolderRouter from "./routers/folderRouter/showFolderRouter.js";
import flash from "connect-flash";
import fileDetailsRouter from "./routers/fileRouters/getFIleDetails.js";
import renameFileRouter from "./routers/fileRouters/renameFileRouter.js";
import deleteFileRouter from "./routers/fileRouters/deleteFileRouter.js";
import downloadFileRouter from "./routers/fileRouters/downloadFile.js";
import multer from "multer";
import shareLinkRouter from "./routers/fileRouters/shareLInkRouter.js";
export const app = express();
// express session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "kitty",
    resave: false,
    saveUninitialized: false,
    // store for persistace of session storage
    cookie: {
      maxAge: 1000 * 60 * 30 * 30,
      secure: config.nodeEnv == "PROD" ? true : false,
      httpOnly: true,
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
app.use(express.static(path.join(import.meta.dirname, "public")));
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
app.use("/renameFile/:fileId", renameFileRouter);
app.use("/deleteFile/:fileId", deleteFileRouter);
app.use("/fileDownload/:fileId", downloadFileRouter);
// Error Handler for server errors
// must be registered LAST, after all routes
app.use("/shareLink/:fileId", shareLinkRouter);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).send("File too large. Max size is 10MB.");
    }
    return res.status(400).send(`Upload error: ${err.message}`);
  }
  res.status(500).send("Something went wrong");
});
app.listen(config.port, () => {
  console.log(`Live: http://localhost:${config.port}`);
});
