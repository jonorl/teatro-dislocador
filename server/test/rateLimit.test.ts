import { describe, it, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { apiLimiter } from "../src/middleware/rateLimit";

const app = express();
app.set("trust proxy", 1);
app.use("/api", apiLimiter);
app.get("/api/ping", (_req, res) => res.json({ ok: true }));

describe("apiLimiter", () => {
  it("allows 300 requests per visitor, then answers 429 with a JSON error", async () => {
    // Same Cloudflare edge for everyone; only the visitor address differs.
    const visitor = (ip: string) =>
      request(app).get("/api/ping").set("X-Forwarded-For", "172.68.1.1").set("CF-Connecting-IP", ip);

    for (let i = 0; i < 300; i++) {
      expect((await visitor("203.0.113.1")).status).toBe(200);
    }
    const blocked = await visitor("203.0.113.1");
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ error: "Too many requests, try again later." });

    // A busy visitor on the same edge server doesn't block anyone else.
    expect((await visitor("203.0.113.2")).status).toBe(200);
  });

  it("falls back to the proxied address for requests that skip Cloudflare", async () => {
    const res = await request(app).get("/api/ping").set("X-Forwarded-For", "198.51.100.7");
    expect(res.status).toBe(200);
    expect(res.headers["ratelimit"]).toContain("r=299");
  });
});
