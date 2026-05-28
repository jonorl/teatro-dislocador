import express from "express";
import { prisma } from "../app";
import { authenticateAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const classes = await prisma.class.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ classes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// src/routes/classes.ts
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const { title, description, schedule } = req.body;
    const newClass = await prisma.class.create({
      data: { title, description, schedule },
    });
    return res.status(201).json(newClass);
  } catch (error) {
    console.error("❌ Prisma Database Error:", error); // <-- ADD THIS LINE
    return res.status(500).json({ error: "Failed to create class" });
  }
});

router.put("/:id", authenticateAdmin, async (req, res) => {
  const { title, description, schedule } = req.body;
  const updated = await prisma.class.update({
    where: { id: req.params.id as string },
    data: { title, description, schedule },
  });
  return res.json(updated);
});

router.delete("/:id", authenticateAdmin, async (req, res) => {
  await prisma.class.delete({ where: { id: req.params.id  as string } });
  return res.status(204).send();
});

export default router;