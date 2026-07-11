import type { Request, Response } from "express";
import express from "express";
import config from "./config/config";
import session from "express-session";
import path from "node:path";
import passport from "passport";
const app = express();

app.use(
  session({
    secret: "kitty",
    resave: false,
    saveUninitialized: false,
    //configure store for persistace session storage
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: config.nodeEnv == "PROD" ? true : false,
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {});
app.listen(config.port, () => {
  console.log(`Live: http://localhost:${config.port}`);
});
