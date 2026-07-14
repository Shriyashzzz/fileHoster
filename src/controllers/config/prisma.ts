import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// use PrismaPg adapter to get the connection from prisma to the database
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma: PrismaClient = new PrismaClient({ adapter });

export default prisma;
