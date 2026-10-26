import "dotenv/config";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import classesRouter from "./routes/classes";
import galleryRouter from "./routes/gallery";
import showcaseRouter from "./routes/showcase";
import uploadRouter from "./routes/upload";
import instagramRouter from "./routes/instagram";
import maintenanceRouter from "./routes/maintenance";
import healthRouter from "./routes/health";
import { apiLimiter, uploadsLimiter } from "./middleware/rateLimit";
import { corsMiddleware } from "./middleware/cors";
import { optimisedUploads, UPLOAD_CACHE } from "./middleware/optimisedUploads";
import { UPLOAD_DIR } from "./middleware/upload";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.disable("x-powered-by");
// Caddy is the proxy Express talks to; behind Cloudflare the visitor's address comes from CF-Connecting-IP (see rateLimit.ts).
app.set("trust proxy", 1);

app.use(corsMiddleware());
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
app.use("/uploads", uploadsLimiter, optimisedUploads(UPLOAD_DIR), express.static(UPLOAD_DIR, UPLOAD_CACHE));

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

// Outside /api so monitoring and the deploy smoke test are never rate-limited.
app.use("/health", healthRouter);
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