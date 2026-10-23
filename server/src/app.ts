import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";                    
import { clerkMiddleware } from "@clerk/express";
import classesRouter from "./routes/classes";
import galleryRouter from "./routes/gallery";
import showcaseRouter from "./routes/showcase";
import uploadRouter from "./routes/upload";
import instagramRouter from "./routes/instagram";
import maintenanceRouter from "./routes/maintenance";
import { apiLimiter } from "./middleware/rateLimit";
import { fileURLToPath } from "url"; 
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Caddy is the one proxy in front, so req.ip is the visitor's address rather than Caddy's and rate limits are per visitor.
app.set("trust proxy", 1);

app.use(cors({ origin: "*" }));
app.use(
  express.json({
    type: (req) => {
      const ct = req.headers["content-type"] ?? "";
      return !ct.startsWith("multipart/");
    },
  })
);
app.use(
  '/clerk',
  createProxyMiddleware({
    target: 'https://frontend-api.clerk.services',
    changeOrigin: true,
    pathRewrite: { '^/clerk': '' },
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));  

const isProd = process.env.MODE === "PROD";

app.use(
  clerkMiddleware({
    publishableKey: isProd 
      ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
      : process.env.DISLOCADOR_PUBLISHABLEKEY,
    secretKey: isProd 
      ? process.env.CLERK_SECRET_KEY 
      : process.env.DISLOCADOR_SECRETKEY,
  })
);

app.use("/api", apiLimiter);
app.use("/api/classes", classesRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/showcase", showcaseRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/gallery/upload", uploadRouter);
app.use("/api/instagram", instagramRouter);
app.use("/api/maintenance", maintenanceRouter);

const PORT: number = Number(process.env.PORT_DISLOCADOR) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});