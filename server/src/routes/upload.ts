// src/routes/upload.ts
import express from "express";
import { authenticateAdmin } from "../middleware/auth";
import { uploadMultiple } from "../middleware/upload";
import { galleryQueries } from "../db/queries";

const router = express.Router();

const isProd = process.env.MODE === "PROD";

const SERVER_URL = isProd
  ? process.env.DISLOCADOR_PROD_SERVER_URL
  : process.env.DISLOCADOR_DEV_SERVER_URL;

// Single image upload (used by ClassesPanel / ShowcasePanel cover images)
router.post("/", authenticateAdmin, uploadMultiple, (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image provided." });
  const baseUrl = SERVER_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

// Multi-image upload (used by GalleryPanel)
router.post("/multiple", authenticateAdmin, uploadMultiple, async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0)
    return res.status(400).json({ error: "No images provided." });
  const baseUrl = SERVER_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);
  const saved = await Promise.all(urls.map((url) => galleryQueries.create(url)));
  return res.json({ urls: saved.map((item) => item.url) });
});

export default router;