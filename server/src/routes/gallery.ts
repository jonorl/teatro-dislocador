import express from "express";
import { prisma } from "../app";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

// Public GET matching frontend image.URL mapper
router.get("/", async (req, res) => {
  try {
    const galleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Formats payload structure to map cleanly onto your frontend's item.URL layout
    const galeria = galleryItems.map(item => ({ id: item.id, url: item.url }));
    
    return res.json({ galeria });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

// CMS: Add image URL
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "Argument 'url' is missing." });
    }

    const newImage = await prisma.gallery.create({ data: { url } });
    return res.status(201).json(newImage);
  } catch (error) {
    console.error("❌ Gallery Create Error:", error);
    return res.status(500).json({ error: "Failed to add image" });
  }
});

// CMS: Delete image
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.gallery.delete({ where: { id: String(id) } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;