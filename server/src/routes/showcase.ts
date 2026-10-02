import express from "express";
import { authenticateAdmin } from "../middleware/auth";
import { showcaseQueries } from "../db/queries";

const router = express.Router();

class InvalidEndsAt extends Error {}

const parseEndsAt = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new InvalidEndsAt();
  return date;
};

router.get("/", async (req, res) => {
  try {
    const cartelera = await showcaseQueries.getAll();
    return res.json({ cartelera });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch showcase items" });
  }
});

router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { title, author, director, dates, duration, description, image, instagramId, endsAt } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Argument 'title' is missing." });
    }
    const show = await showcaseQueries.create({ title, author, director, dates, duration, description, image, instagramId, endsAt: parseEndsAt(endsAt) });
    return res.status(201).json(show);
  } catch (error) {
    if (error instanceof InvalidEndsAt) return res.status(400).json({ error: "Argument 'endsAt' is not a valid date." });
    console.error("❌ Showcase Create Error:", error);
    return res.status(500).json({ error: "Failed to create show" });
  }
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, director, dates, duration, description, image, instagramId, endsAt } = req.body;
    const updated = await showcaseQueries.update(id as string, { title, author, director, dates, duration, description, image, instagramId, endsAt: parseEndsAt(endsAt) });
    return res.json(updated);
  } catch (error) {
    if (error instanceof InvalidEndsAt) return res.status(400).json({ error: "Argument 'endsAt' is not a valid date." });
    console.error("❌ Showcase Update Error:", error);
    return res.status(500).json({ error: "Failed to update show" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await showcaseQueries.delete(req.params.id as string);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete show" });
  }
});

export default router;