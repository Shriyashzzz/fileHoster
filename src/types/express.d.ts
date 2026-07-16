// src/types/express.d.ts
import { Users as PrismaUser } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}
