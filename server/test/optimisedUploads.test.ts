import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { randomBytes } from "crypto";
import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import request from "supertest";
import sharp from "sharp";
import { optimisedUploads, removeOptimisedCopies, UPLOAD_CACHE, CACHE_DIR_NAME } from "../src/middleware/optimisedUploads";
import { uploadsLimiter } from "../src/middleware/rateLimit";

let dir: string;
let app: express.Express;
const WEBP_ACCEPT = "image/avif,image/webp,image/apng,*/*;q=0.8";

// Random pixels compress badly, like a photo, so the original is large.
const photo = (width: number, height: number) =>
  sharp(randomBytes(width * height * 3), {
    raw: { width, height, channels: 3 },
  });

const binary = (res: request.Response, cb: (err: Error | null, body: Buffer) => void) => {
  const chunks: Buffer[] = [];
  res.on("data", (c: Buffer) => chunks.push(c));
  res.on("end", () => cb(null, Buffer.concat(chunks)));
};
const get = (file: string, accept = WEBP_ACCEPT) =>
  request(app).get(`/uploads/${file}`).set("Accept", accept).buffer(true).parse(binary);

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "td-optimised-"));
  await photo(2400, 1800).png().toFile(path.join(dir, "big.png"));
  await photo(2400, 1800).jpeg({ quality: 95 }).toFile(path.join(dir, "big.jpg"));
  await photo(400, 300).png().toFile(path.join(dir, "small.png"));
  fs.writeFileSync(path.join(dir, "broken.png"), "not an image");
  fs.writeFileSync(path.join(dir, "anim.gif"), "GIF89a");
  app = express();
  app.use("/uploads", uploadsLimiter, optimisedUploads(dir), express.static(dir, UPLOAD_CACHE));
});

afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

beforeEach(() => {
  fs.rmSync(path.join(dir, CACHE_DIR_NAME), { recursive: true, force: true });
});

describe("optimisedUploads", () => {
  it("serves a resized WebP to browsers that accept it", async () => {
    const res = await get("big.png");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("image/webp");
    expect(res.headers["vary"]).toContain("Accept");
    expect(res.headers["cache-control"]).toBe("public, max-age=31536000, immutable");

    const meta = await sharp(res.body).metadata();
    expect(Math.max(meta.width!, meta.height!)).toBe(1600);
    expect(res.body.length).toBeLessThan(fs.statSync(path.join(dir, "big.png")).size / 2);
  });

  it("serves a resized copy in the original format to browsers without WebP", async () => {
    const res = await get("big.jpg", "*/*");
    expect(res.headers["content-type"]).toBe("image/jpeg");
    const meta = await sharp(res.body).metadata();
    expect(meta.format).toBe("jpeg");
    expect(meta.width).toBe(1600);
  });

  it("never enlarges small images", async () => {
    const meta = await sharp((await get("small.png")).body).metadata();
    expect(meta.width).toBe(400);
  });

  it("makes each copy once and reuses it", async () => {
    await get("big.png");
    const copy = path.join(dir, CACHE_DIR_NAME, "big.png.webp");
    const firstWrite = fs.statSync(copy).mtimeMs;
    await new Promise((r) => setTimeout(r, 20));
    await get("big.png");
    expect(fs.statSync(copy).mtimeMs).toBe(firstWrite);
  });

  it("leaves the original untouched", async () => {
    const before = fs.statSync(path.join(dir, "big.png")).size;
    await get("big.png");
    expect(fs.statSync(path.join(dir, "big.png")).size).toBe(before);
  });

  it("falls back to the original when the file can't be converted", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const res = await get("broken.png");
    expect(res.status).toBe(200);
    expect(res.body.toString()).toBe("not an image");
  });

  it("passes other files straight through, with the long cache", async () => {
    const res = await get("anim.gif");
    expect(res.status).toBe(200);
    expect(res.headers["vary"]).toBeUndefined();
    expect(res.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });

  it("answers 404 for missing files", async () => {
    expect((await get("missing.png")).status).toBe(404);
  });

  it("refuses paths outside the upload folder", async () => {
    const res = await request(app).get("/uploads/..%2f..%2fetc%2fpasswd.png").set("Accept", WEBP_ACCEPT);
    expect(res.status).toBe(404);
  });

  it("does not expose the copies folder directly", async () => {
    await get("big.png");
    expect((await get(`${CACHE_DIR_NAME}/big.png.webp`)).status).toBe(404);
  });

  it("removes both copies when an upload is deleted", async () => {
    await get("big.png");
    await get("big.png", "*/*");
    expect(fs.readdirSync(path.join(dir, CACHE_DIR_NAME)).sort()).toEqual(["big.png.resized.png", "big.png.webp"]);
    await removeOptimisedCopies(dir, "big.png");
    expect(fs.readdirSync(path.join(dir, CACHE_DIR_NAME))).toEqual([]);
  });
});
