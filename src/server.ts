import type { Request, Response } from "express";
import express from "express";
import config from "./config/config";
import session from "express-session";
import path from "node:path";
import passport from "passport";
import { homeRouter } from "./routers/homeRouter";
import { deserializer, localStrat, serializer } from "./auth";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./config/prisma";
import loginRouter from "./routers/loginRouter";
import signUpRouter from "./routers/signUpRouter";
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "kitty",
    resave: false,
    saveUninitialized: false,
    //configure store for persistace session storage
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: config.nodeEnv == "PROD" ? true : false,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
    }),
  }),
);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
// passport studd
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrat);
passport.serializeUser(serializer as any);
passport.deserializeUser(deserializer as any);

// routes
app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/signup", signUpRouter);
app.listen(config.port, () => {
  console.log(`Live: http://localhost:${config.port}`);
});
