import express from "express";
import { prisma } from "../app";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

// Public GET for the frontend component
router.get("/", async (req, res) => {
  try {
    const cartelera = await prisma.showcase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.json({ cartelera });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch showcase items" });
  }
});

// CMS: Create new show
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { title, author, director, dates, duration, description, image } = req.body;
    
    // Quick safety check against mandatory fields to keep Prisma happy
    if (!title) {
      return res.status(400).json({ error: "Argument 'title' is missing." });
    }

    const show = await prisma.showcase.create({
      data: { title, author, director, dates, duration, description, image },
    });
    return res.status(201).json(show);
  } catch (error) {
    console.error("❌ Showcase Create Error:", error);
    return res.status(500).json({ error: "Failed to create show" });
  }
});

// CMS: Update show
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, director, dates, duration, description, image } = req.body;
    
    const updated = await prisma.showcase.update({
      where: { id: Number(id) },
      data: { title, author, director, dates, duration, description, image },
    });
    return res.json(updated);
  } catch (error) {
    console.error("❌ Showcase Update Error:", error);
    return res.status(500).json({ error: "Failed to update show" });
  }
});

// CMS: Delete show
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.showcase.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete show" });
  }
});

export default router;