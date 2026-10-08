import express from "express";
import fs from "fs/promises";
import path from "path";
import { authenticateAdmin } from "../middleware/auth";
import { UPLOAD_DIR } from "../middleware/upload";
import { maintenanceQueries } from "../db/queries";

const router = express.Router();

// The CMS uploads an image before the show/class is saved, so a brand-new file is briefly unreferenced.
const GRACE_DAYS = 7;

// Compares by file name, so references survive a change of API host (dev vs prod URLs).
const uploadedFileName = (url: string) => {
  try {
    const { pathname } = new URL(url);
    return pathname.startsWith("/uploads/") ? path.basename(pathname) : null;
  } catch {
    return null;
  }
};

// Dry run unless the body says { "dryRun": false }, so a stray call can only report.
router.post("/cleanup-uploads", authenticateAdmin, async (req, res) => {
  try {
    const dryRun = req.body?.dryRun !== false;
    const referenced = new Set(
      (await maintenanceQueries.getReferencedImageUrls()).map(uploadedFileName).filter(Boolean),
    );
    const cutoff = Date.now() - GRACE_DAYS * 24 * 60 * 60 * 1000;

    const unused: { file: string; sizeKb: number }[] = [];
    for (const file of await fs.readdir(UPLOAD_DIR)) {
      if (referenced.has(file)) continue;
      const stat = await fs.stat(path.join(UPLOAD_DIR, file));
      if (!stat.isFile() || stat.mtimeMs > cutoff) continue;
      unused.push({ file, sizeKb: Math.round(stat.size / 1024) });
    }

    if (!dryRun) {
      await Promise.all(unused.map(({ file }) => fs.unlink(path.join(UPLOAD_DIR, file))));
    }
    return res.json({ dryRun, referenced: referenced.size, removed: unused });
  } catch (error) {
    console.error("❌ Upload Cleanup Error:", error);
    return res.status(500).json({ error: "Failed to clean up uploads" });
  }
});

export default router;
