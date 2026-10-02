import express from "express";
import { authenticateAdmin } from "../middleware/auth";
import { instagramQueries, showcaseQueries } from "../db/queries";

const router = express.Router();

// The workflow only fetches Instagram's latest posts, so the most recent IDs are enough to deduplicate against.
router.get("/processed", authenticateAdmin, async (req, res) => {
  try {
    const posts = await instagramQueries.getRecentIds(200);
    return res.json({ ids: posts.map((post) => post.id) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch processed posts" });
  }
});

router.post("/processed", authenticateAdmin, async (req, res) => {
  try {
    const { id, decision } = req.body;
    if (!id || decision === undefined) {
      return res.status(400).json({ error: "Arguments 'id' and 'decision' are required." });
    }
    const post = await instagramQueries.record(String(id), decision);
    return res.status(201).json(post);
  } catch (error) {
    console.error("❌ Instagram Record Error:", error);
    return res.status(500).json({ error: "Failed to record post" });
  }
});

router.post("/expire-shows", authenticateAdmin, async (req, res) => {
  try {
    const removed = await showcaseQueries.deleteExpired(new Date());
    return res.json({ removed });
  } catch (error) {
    console.error("❌ Instagram Expire Error:", error);
    return res.status(500).json({ error: "Failed to remove expired shows" });
  }
});

export default router;
