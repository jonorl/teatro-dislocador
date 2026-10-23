import express from "express";
import { healthQueries } from "../db/queries";

const router = express.Router();

// Polling can't hammer Postgres: the database answer is reused for a few seconds.
const CACHE_MS = 5000;
let lastCheck: { at: number; ok: boolean } | undefined;

const databaseOk = async () => {
  if (lastCheck && Date.now() - lastCheck.at < CACHE_MS) return lastCheck.ok;
  const ok = await healthQueries.ping().then(() => true, () => false);
  lastCheck = { at: Date.now(), ok };
  return ok;
};

// version is the commit the image was built from, so a deploy can tell the new container is the one answering.
router.get("/", async (_req, res) => {
  const ok = await databaseOk();
  return res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "error",
    database: ok ? "ok" : "unreachable",
    version: process.env.GIT_SHA ?? "dev",
  });
});

export const resetHealthCache = () => {
  lastCheck = undefined;
};

export default router;
