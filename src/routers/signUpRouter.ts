import bcrypt from "bcryptjs";
import { Router } from "express";
import type { Request, Response } from "express";
import { validationResult, matchedData, body } from "express-validator";
import prisma from "../config/prisma";
const signUpRouter = Router();

signUpRouter.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("signup.ejs");
  }
});
const emptyError = `cannot be empty!`;

const validationMiddleware = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(` Username ${emptyError}`)
    .isLength({ min: 5 })
    .withMessage("Username has to be atleast 5 charachthers long "),
  body("email")
    .isEmail()
    .withMessage("Make sure the email is valid. EX: xyz@email.com"),
  body("password").notEmpty().withMessage(`Password field ${emptyError}`),
  body("cpassword")
    .notEmpty()
    .withMessage(`Confirm password field ${emptyError}`)
    .custom((value, { req }) => {
      const isEqual = value === req.body.password;
      if (!isEqual) {
        throw new Error("Please make sure your passwords match");
      }
      //returning true tells the custom validator that it's valid
      return true;
    }),
];

signUpRouter.post(
  "/",
  validationMiddleware,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, username, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await prisma.users.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
        },
      });
      res.redirect("/login");
    } else {
      res.render("/signup.ejs", { errors: errors.array() });
    }
  },
);

export default signUpRouter;
