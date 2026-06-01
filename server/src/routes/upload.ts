// src/routes/upload.ts
import express from "express";
import { authenticateAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();

const isProd = process.env.MODE === "PROD";

const SERVER_URL = isProd
  ? process.env.DISLOCADOR_PROD_SERVER_URL
  : process.env.DISLOCADOR_DEV_SERVER_URL

console.log("DEBUG ENV:", {
  MODE: process.env.MODE,
  DEV_URL: process.env.DISLOCADOR_DEV_SERVER_URL,
  PROD_URL: process.env.DISLOCADOR_PROD_SERVER_URL
});

router.post("/", authenticateAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image provided." });
  const baseUrl = SERVER_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

export default router;