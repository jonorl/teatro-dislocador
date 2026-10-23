import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Lives apart from app.ts so the query modules don't import the entrypoint, which imports them back.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL_DISLOCADOR });
export const prisma = new PrismaClient({ adapter });
