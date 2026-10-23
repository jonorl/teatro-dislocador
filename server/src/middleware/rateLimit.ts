import { rateLimit } from "express-rate-limit";

// A page view costs 3 API calls and the hourly n8n sync about 30, so 300 per 15 minutes leaves plenty of room
// for real visitors while capping scripted abuse of the routes that touch the database or the disk.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, try again later." },
});
