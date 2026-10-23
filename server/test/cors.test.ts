import { describe, it, expect, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import { corsMiddleware } from "../src/middleware/cors";

const appWithCors = () => {
  const app = express();
  app.use(corsMiddleware());
  app.get("/api/classes", (_req, res) => res.json({ classes: [] }));
  return app;
};

const allowOrigin = async (origin: string) =>
  (await request(appWithCors()).get("/api/classes").set("Origin", origin)).headers["access-control-allow-origin"];

afterEach(() => {
  process.env.NODE_ENV = "test";
});

describe("corsMiddleware", () => {
  it.each([
    "https://teatrodislocador.ar",
    "https://admin.teatrodislocador.ar",
    "https://teatro-dislocador.pages.dev",
    "https://57b826e0.teatro-dislocador.pages.dev",
    "https://7187e33b.teatro-dislocador-crm.pages.dev",
  ])("allows %s", async (origin) => {
    expect(await allowOrigin(origin)).toBe(origin);
  });

  it.each([
    "https://evil.example",
    "http://teatrodislocador.ar",
    "https://teatrodislocador.ar.evil.example",
    "https://evil-teatro-dislocador.pages.dev",
    "http://localhost:5173",
  ])("refuses %s", async (origin) => {
    expect(await allowOrigin(origin)).toBeUndefined();
  });

  it("allows localhost only when NODE_ENV is development", async () => {
    process.env.NODE_ENV = "development";
    expect(await allowOrigin("http://localhost:5173")).toBe("http://localhost:5173");
  });

  it("still serves server-side callers that send no Origin", async () => {
    const res = await request(appWithCors()).get("/api/classes");
    expect(res.status).toBe(200);
  });

  it("answers the admin's preflight for authenticated writes", async () => {
    const res = await request(appWithCors())
      .options("/api/classes")
      .set("Origin", "https://admin.teatrodislocador.ar")
      .set("Access-Control-Request-Method", "PUT")
      .set("Access-Control-Request-Headers", "authorization,content-type");
    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("https://admin.teatrodislocador.ar");
    expect(res.headers["access-control-allow-methods"]).toContain("PUT");
  });
});
