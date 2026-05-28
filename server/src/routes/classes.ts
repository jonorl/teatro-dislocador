import express from "express";
import { authenticateAdmin } from "../middleware/auth";
import { classQueries } from "../db/queries";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const classes = await classQueries.getAll();
    return res.json({ classes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch classes" });
  }
});

router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { title, description, schedule } = req.body;
    const newClass = await classQueries.create({ title, description, schedule });
    return res.status(201).json(newClass);
  } catch (error) {
    console.error("❌ Prisma Database Error:", error);
    return res.status(500).json({ error: "Failed to create class" });
  }
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const { title, description, schedule } = req.body;
    const updated = await classQueries.update(req.params.id as string, { title, description, schedule });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update class" });
  }
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await classQueries.delete(req.params.id as string);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete class" });
  }
});

export default router;