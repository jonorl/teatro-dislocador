import express from "express";
import path from "path";
import fs from "fs";
import { authenticateAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { galleryQueries } from "../db/queries";

const isProd = process.env.MODE === "production";

const SERVER_URL = isProd
  ? process.env.DISLOCADOR_PROD_SERVER_URL
  : process.env.DISLOCADOR_DEV_SERVER_URL

const router = express.Router();

// GET — unchanged
router.get("/", async (req, res) => {
  try {
    const galleryItems = await galleryQueries.getAll();
    const galeria = galleryItems.map(item => ({ id: item.id, url: item.url }));
    return res.json({ galeria });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// POST /api/gallery — add by external URL (unchanged behaviour)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Argument 'url' is missing." });
    }
    const newImage = await galleryQueries.create(url);
    return res.status(201).json(newImage);
  } catch (error) {
    console.error("❌ Gallery Create Error:", error);
    return res.status(500).json({ error: "Failed to add image" });
  }
});

// POST /api/gallery/upload — upload a file from your PC
router.post("/upload", authenticateAdmin, upload.single("image"), async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const baseUrl = SERVER_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const publicUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const newImage = await galleryQueries.create(publicUrl);
    return res.status(201).json(newImage);
  } catch (error) {
    console.error("❌ Gallery Upload Error:", error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

// DELETE — now also cleans up local files
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const item = await galleryQueries.getById(req.params.id);

    await galleryQueries.delete(req.params.id as string);

    // If it's a locally-hosted file, delete it from disk too
    if (item?.url?.includes("/uploads/")) {
      const filename = path.basename(item.url);
      const filepath = path.join(__dirname, "../../uploads", filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;