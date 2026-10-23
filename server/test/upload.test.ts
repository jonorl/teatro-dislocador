import { jest, describe, it, expect, afterEach } from "@jest/globals";
import fs from "fs";
import path from "path";
import request from "supertest";
import { galleryQueries } from "../src/db/queries";
import { UPLOAD_DIR } from "../src/middleware/upload";
import router from "../src/routes/upload";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/db/queries", () => ({ galleryQueries: { create: jest.fn() } }));

// Uses the real multer setup, so accepted files land in server/uploads; each test removes what it wrote.
const queries = jest.mocked(galleryQueries);
const app = appWith("/api/upload", router);
const PNG = Buffer.from("89504e470d0a1a0a", "hex");
const written: string[] = [];
const fileOf = (url: string) => {
  const name = path.basename(new URL(url).pathname);
  written.push(name);
  return name;
};

afterEach(() => {
  for (const name of written.splice(0)) fs.rmSync(path.join(UPLOAD_DIR, name), { force: true });
});

describe("POST /api/upload", () => {
  it("saves an image and returns its public url", async () => {
    const res = await request(app).post("/api/upload").attach("image", PNG, { filename: "foto.png", contentType: "image/png" });
    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/\/uploads\/\d+-\d+\.png$/);
    expect(fs.existsSync(path.join(UPLOAD_DIR, fileOf(res.body.url)))).toBe(true);
  });

  it("rejects files that are not images", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("image", Buffer.from("hola"), { filename: "notas.txt", contentType: "text/plain" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Solo se permiten/);
  });

  it("asks for a file when none is sent", async () => {
    const res = await request(app).post("/api/upload").field("title", "x");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No image provided.");
  });

  it("rejects files over 10 MB", async () => {
    const big = Buffer.alloc(10 * 1024 * 1024 + 1);
    const res = await request(app).post("/api/upload").attach("image", big, { filename: "big.png", contentType: "image/png" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Máximo 10MB/);
  });
});

describe("POST /api/upload/multiple", () => {
  it("saves every image and records each one in the gallery", async () => {
    queries.create.mockImplementation(async (url: string) => ({ id: "x", url, createdAt: new Date() }));
    const res = await request(app)
      .post("/api/upload/multiple")
      .attach("images", PNG, { filename: "a.png", contentType: "image/png" })
      .attach("images", PNG, { filename: "b.png", contentType: "image/png" });

    expect(res.status).toBe(200);
    expect(res.body.urls).toHaveLength(2);
    res.body.urls.forEach(fileOf);
    expect(queries.create).toHaveBeenCalledTimes(2);
  });

  it("rejects more than 12 images", async () => {
    let req = request(app).post("/api/upload/multiple");
    for (let i = 0; i < 13; i++) req = req.attach("images", PNG, { filename: `${i}.png`, contentType: "image/png" });
    const res = await req;
    expect(res.status).toBe(400);
    expect(queries.create).not.toHaveBeenCalled();
  });
});
