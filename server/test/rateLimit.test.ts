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
    for (let i = 0; i < 300; i++) {
      const res = await request(app).get("/api/ping").set("X-Forwarded-For", "203.0.113.1");
      expect(res.status).toBe(200);
    }
    const blocked = await request(app).get("/api/ping").set("X-Forwarded-For", "203.0.113.1");
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({ error: "Too many requests, try again later." });

    // Counted per forwarded address, so one busy visitor does not block the rest.
    const other = await request(app).get("/api/ping").set("X-Forwarded-For", "203.0.113.2");
    expect(other.status).toBe(200);
  });
});
