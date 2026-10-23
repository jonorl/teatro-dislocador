import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import fs from "fs";
import os from "os";
import path from "path";
import request from "supertest";
import { galleryQueries } from "../src/db/queries";
import router from "../src/routes/gallery";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/db/queries", () => ({
  galleryQueries: { getAll: jest.fn(), create: jest.fn(), getById: jest.fn(), delete: jest.fn() },
}));

const queries = jest.mocked(galleryQueries);
const app = appWith("/api/gallery", router);
let uploadDir: string;

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "td-gallery-"));
  process.env.UPLOAD_DIR = uploadDir;
});

afterEach(() => {
  fs.rmSync(uploadDir, { recursive: true, force: true });
  delete process.env.UPLOAD_DIR;
});

describe("GET /api/gallery", () => {
  it("returns only id and url under galeria", async () => {
    queries.getAll.mockResolvedValue([{ id: "1", url: "https://x/a.jpg", createdAt: new Date() }] as any);
    const res = await request(app).get("/api/gallery");
    expect(res.body).toEqual({ galeria: [{ id: "1", url: "https://x/a.jpg" }] });
  });
});

describe("POST /api/gallery", () => {
  it("requires a url", async () => {
    const res = await request(app).post("/api/gallery").send({});
    expect(res.status).toBe(400);
    expect(queries.create).not.toHaveBeenCalled();
  });

  it("stores an external url", async () => {
    queries.create.mockResolvedValue({ id: "1", url: "https://x/a.jpg" } as any);
    const res = await request(app).post("/api/gallery").send({ url: "https://x/a.jpg" });
    expect(res.status).toBe(201);
    expect(queries.create).toHaveBeenCalledWith("https://x/a.jpg");
  });
});

describe("DELETE /api/gallery/:id", () => {
  it("removes the uploaded file along with the row", async () => {
    const file = path.join(uploadDir, "123-photo.jpg");
    fs.writeFileSync(file, "img");
    queries.getById.mockResolvedValue({ id: "1", url: "https://api.example/uploads/123-photo.jpg" } as any);

    const res = await request(app).delete("/api/gallery/1");

    expect(res.status).toBe(204);
    expect(queries.delete).toHaveBeenCalledWith("1");
    expect(fs.existsSync(file)).toBe(false);
  });

  it("leaves files alone for external images", async () => {
    const file = path.join(uploadDir, "photo.jpg");
    fs.writeFileSync(file, "img");
    queries.getById.mockResolvedValue({ id: "1", url: "https://cdn.example/photo.jpg" } as any);

    await request(app).delete("/api/gallery/1");

    expect(fs.existsSync(file)).toBe(true);
  });

  it("only deletes inside the upload folder, whatever the stored url says", async () => {
    const outside = path.join(path.dirname(uploadDir), `${path.basename(uploadDir)}-outside.txt`);
    fs.writeFileSync(outside, "keep");
    queries.getById.mockResolvedValue({ id: "1", url: `https://x/uploads/../../${path.basename(outside)}` } as any);

    await request(app).delete("/api/gallery/1");

    expect(fs.existsSync(outside)).toBe(true);
    fs.rmSync(outside);
  });

  it("still succeeds when the file is already gone", async () => {
    queries.getById.mockResolvedValue({ id: "1", url: "https://x/uploads/missing.jpg" } as any);
    const res = await request(app).delete("/api/gallery/1");
    expect(res.status).toBe(204);
  });
});
