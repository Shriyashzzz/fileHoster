import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./controllers/config/prisma";
import type { Users } from "./generated/prisma/client";

const localStrat = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    } else {
      return done(null, false, { message: "User does not Exist" });
    }
  } catch (e) {
    return done(e);
  }
});

const serializer = (user: Users, done: (err: any, id?: number) => void) => {
  return done(null, user.id);
};

const deserializer = async (
  id: number,
  done: (err: any, user?: Users | false | null) => void,
) => {
  try {
    const user = await prisma.users.findUnique({ where: { id: id } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
export { localStrat, serializer, deserializer };
