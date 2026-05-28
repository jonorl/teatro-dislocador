import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";                    
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";
import classesRouter from "./routes/classes";
import galleryRouter from "./routes/gallery";
import showcaseRouter from "./routes/showcase";
import uploadRouter from "./routes/upload";
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL_DISLOCADOR });
export const prisma = new PrismaClient({ adapter });

app.use(cors({ origin: "*" }));
app.use(
  express.json({
    type: (req) => {
      const ct = req.headers["content-type"] ?? "";
      return !ct.startsWith("multipart/");
    },
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));  

app.use(
  clerkMiddleware({
    publishableKey: process.env.DISLOCADOR_PUBLISHABLEKEY,
    secretKey: process.env.DISLOCADOR_SECRETKEY,
  })
);

app.use("/api/classes", classesRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/showcase", showcaseRouter);
app.use("/api/upload", uploadRouter);

const PORT: number = Number(process.env.PORT_DISLOCADOR) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});