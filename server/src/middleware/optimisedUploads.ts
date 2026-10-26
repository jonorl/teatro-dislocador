import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Uploads arrive at full camera size (often 2-3 MB). Pages show them at a few hundred pixels, so each image is
// served as a resized copy, made on first request and kept on disk. URLs stay the same, so the database and
// the site's snapshot need no changes, and the originals are kept untouched.
const MAX_SIZE = 1600;
const QUALITY = 78;
export const CACHE_DIR_NAME = ".optimised";
const RESIZABLE = /^[\w.-]+\.(jpe?g|png)$/i;
// Each upload has a unique name and never changes, so browsers and Cloudflare may keep it for a year.
export const UPLOAD_CACHE = { maxAge: 365 * 24 * 60 * 60 * 1000, immutable: true };

// Accept: */* would also match image/webp, so only browsers that name WebP get it.
const wantsWebp = (req: Request) => (req.headers.accept ?? "").includes("image/webp");

const variantName = (name: string, webp: boolean) => (webp ? `${name}.webp` : `${name}.resized${path.extname(name)}`);

// RESIZABLE already rules out slashes, but a resolved-path check is the guard CodeQL recognises, and it also
// covers callers that pass names from elsewhere.
const inside = (root: string, ...parts: string[]) => {
  const base = path.resolve(root);
  const full = path.resolve(base, ...parts);
  return full.startsWith(base + path.sep) ? full : null;
};

const createVariant = async (original: string, target: string, webp: boolean) => {
  await fs.mkdir(path.dirname(target), { recursive: true });
  // Written under a temporary name, so a request arriving mid-conversion never gets half a file.
  const tmp = `${target}.${randomUUID()}.tmp`;
  let image = sharp(original).rotate().resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true });
  if (webp) image = image.webp({ quality: QUALITY });
  else if (/\.png$/i.test(original)) image = image.png({ compressionLevel: 9 });
  else image = image.jpeg({ quality: QUALITY, mozjpeg: true });
  await image.toFile(tmp);
  await fs.rename(tmp, target);
};

export const optimisedUploads = (uploadDir: string) => async (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const name = decodeURIComponent(req.path.slice(1));
  if (!RESIZABLE.test(name)) return next();

  const original = inside(uploadDir, name);
  if (!original) return next();
  try {
    await fs.access(original);
  } catch {
    return next(); // express.static answers the 404
  }

  const webp = wantsWebp(req);
  const variant = inside(uploadDir, CACHE_DIR_NAME, variantName(name, webp));
  if (!variant) return next();
  try {
    await fs.access(variant);
  } catch {
    try {
      await createVariant(original, variant, webp);
    } catch (error) {
      console.error("❌ Image optimisation failed, serving the original:", name, error);
      return next();
    }
  }

  // Vary: Accept keeps caches from handing the WebP copy to a browser that asked for the original format.
  res.setHeader("Vary", "Accept");
  // dotfiles: the copies live in a dot-folder, which sendFile refuses by default.
  return res.sendFile(variant, { ...UPLOAD_CACHE, dotfiles: "allow" });
};

// Called wherever an upload is deleted, so its resized copies don't linger.
export const removeOptimisedCopies = async (uploadDir: string, name: string) => {
  await Promise.all(
    [variantName(name, true), variantName(name, false)].map((file) => {
      const target = inside(uploadDir, CACHE_DIR_NAME, file);
      return target ? fs.rm(target, { force: true }) : undefined;
    }),
  );
};

