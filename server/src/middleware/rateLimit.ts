import type { Request } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Requests pass through Cloudflare and then Caddy, so req.ip is a Cloudflare edge server shared by many visitors.
// Cloudflare puts the visitor's own address in CF-Connecting-IP; req.ip only applies to requests that skip Cloudflare.
const visitorIp = (req: Request) => {
  const header = req.headers["cf-connecting-ip"];
  return (Array.isArray(header) ? header[0] : header) ?? req.ip ?? "";
};

// A page view costs 3 API calls and the hourly n8n sync about 30, so 300 per 15 minutes leaves plenty of room
// for real visitors while capping scripted abuse of the routes that touch the database or the disk.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(visitorIp(req)),
  message: { error: "Too many requests, try again later." },
});
