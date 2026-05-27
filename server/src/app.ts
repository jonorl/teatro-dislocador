import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";
import { clerkMiddleware } from "@clerk/express";
import classesRouter from "./routes/classes";

const app = express();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL_DISLOCADOR,
  max: 20,                       // Increased max connections slightly
  idleTimeoutMillis: 30000,      // Increase to 30 seconds so it doesn't drop prematurely
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(
  clerkMiddleware({
    publishableKey: "pk_test_ZnVubnktY2FpbWFuLTkyLmNsZXJrLmFjY291bnRzLmRldiQ",
    secretKey: "sk_test_pT6eHgTdHDjmkf21iNSFRLqOAJVjBTg7zZ0QgLO8bi",
  })
);

// Route registration
app.use("/api/classes", classesRouter);

const PORT: number = Number(process.env.PORT_DISLOCADOR) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});