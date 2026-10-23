import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import fs from "fs";
import path from "path";
import request from "supertest";
import { maintenanceQueries } from "../src/db/queries";
import { UPLOAD_DIR } from "../src/middleware/upload";
import router from "../src/routes/maintenance";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/middleware/upload", () => ({
  UPLOAD_DIR: require("path").join(require("os").tmpdir(), `td-maintenance-${process.pid}`),
}));
jest.mock("../src/db/queries", () => ({ maintenanceQueries: { getReferencedImageUrls: jest.fn() } }));

const queries = jest.mocked(maintenanceQueries);
const app = appWith("/api/maintenance", router);
const DAY = 24 * 60 * 60 * 1000;

const addFile = (name: string, ageDays: number) => {
  const file = path.join(UPLOAD_DIR, name);
  fs.writeFileSync(file, Buffer.alloc(2048));
  const when = new Date(Date.now() - ageDays * DAY);
  fs.utimesSync(file, when, when);
};
const exists = (name: string) => fs.existsSync(path.join(UPLOAD_DIR, name));

beforeEach(() => {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  addFile("used-by-show.jpg", 30);
  addFile("used-by-gallery.png", 30);
  addFile("orphan.jpg", 30);
  addFile("fresh-orphan.jpg", 1);
  fs.mkdirSync(path.join(UPLOAD_DIR, "a-folder"));
  queries.getReferencedImageUrls.mockResolvedValue([
    // Different hosts on purpose: matching is by file name, so dev and prod URLs both count.
    "http://localhost:3000/uploads/used-by-show.jpg",
    "https://api.teatrodislocador.ar/uploads/used-by-gallery.png",
    "https://cdn.example/elsewhere.jpg",
    "not a url",
  ]);
});

afterEach(() => {
  fs.rmSync(UPLOAD_DIR, { recursive: true, force: true });
});

describe("POST /api/maintenance/cleanup-uploads", () => {
  it("only reports by default", async () => {
    const res = await request(app).post("/api/maintenance/cleanup-uploads");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ dryRun: true, referenced: 2, removed: [{ file: "orphan.jpg", sizeKb: 2 }] });
    expect(exists("orphan.jpg")).toBe(true);
  });

  it("still only reports for anything other than dryRun: false", async () => {
    const res = await request(app).post("/api/maintenance/cleanup-uploads").send({ dryRun: "false" });
    expect(res.body.dryRun).toBe(true);
    expect(exists("orphan.jpg")).toBe(true);
  });

  it("deletes old unreferenced files when dryRun is false", async () => {
    const res = await request(app).post("/api/maintenance/cleanup-uploads").send({ dryRun: false });
    expect(res.body.removed).toEqual([{ file: "orphan.jpg", sizeKb: 2 }]);
    expect(exists("orphan.jpg")).toBe(false);
    expect(exists("fresh-orphan.jpg")).toBe(true);
    expect(exists("used-by-show.jpg")).toBe(true);
    expect(exists("used-by-gallery.png")).toBe(true);
    expect(exists("a-folder")).toBe(true);
  });

  it("deletes nothing when the database cannot be read", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    queries.getReferencedImageUrls.mockRejectedValue(new Error("db down"));
    const res = await request(app).post("/api/maintenance/cleanup-uploads").send({ dryRun: false });
    expect(res.status).toBe(500);
    expect(exists("used-by-show.jpg")).toBe(true);
  });
});
