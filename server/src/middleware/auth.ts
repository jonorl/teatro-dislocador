import { Request, Response, NextFunction } from "express";
import { createHash, timingSafeEqual } from "crypto";
import { getAuth, clerkClient } from "@clerk/express";

// Hashing first gives equal-length buffers, which timingSafeEqual requires.
const sha256 = (value: string) => createHash("sha256").update(value).digest();

// The n8n Instagram workflow can't hold a Clerk session, so it authenticates with a shared token.
const isAutomationRequest = (req: Request) => {
  const expected = process.env.AUTOMATION_TOKEN;
  const header = req.headers.authorization;
  if (!expected || !header?.startsWith("Bearer ")) return false;
  return timingSafeEqual(sha256(header.slice(7)), sha256(expected));
};

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development" || req.hostname === "localhost" || req.hostname === "127.0.0.1") {
    return next();
  }

  if (isAutomationRequest(req)) return next();

  try {
    const { userId } = getAuth(req as any);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const allowedAdmins = ["jonorl@gmail.com", "c.ramiro.aibar@gmail.com", "teatro.dislocador@gmail.com"];

    if (!userEmail || !allowedAdmins.includes(userEmail)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server auth error." });
  }
};