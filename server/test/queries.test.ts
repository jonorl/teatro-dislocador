import { jest, describe, it, expect } from "@jest/globals";
import { prisma } from "../src/db/client";
import { showcaseQueries, maintenanceQueries } from "../src/db/queries";

// The real client needs Postgres, so it is replaced outright.
jest.mock("../src/db/client", () => ({
  prisma: {
    showcase: { findMany: jest.fn(), deleteMany: jest.fn() },
    class: { findMany: jest.fn() },
    gallery: { findMany: jest.fn() },
  },
}));

const db = prisma as any;

describe("showcaseQueries.deleteExpired", () => {
  it("removes Instagram shows a month after they end and undated shows a month after their last edit", async () => {
    db.showcase.findMany.mockResolvedValue([{ id: "a", title: "Hamlet" }, { id: "b", title: "Yerma" }]);
    const now = new Date("2026-10-31T12:00:00Z");
    const monthAgo = new Date("2026-10-01T12:00:00Z");

    const removed = await showcaseQueries.deleteExpired(now);

    expect(db.showcase.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { instagramId: { not: null }, endsAt: { lt: monthAgo } },
          { endsAt: null, updatedAt: { lt: monthAgo } },
        ],
      },
      select: { id: true, title: true },
    });
    expect(db.showcase.deleteMany).toHaveBeenCalledWith({ where: { id: { in: ["a", "b"] } } });
    expect(removed).toEqual([{ id: "a", title: "Hamlet" }, { id: "b", title: "Yerma" }]);
  });
});

describe("maintenanceQueries.getReferencedImageUrls", () => {
  it("collects image urls from every table and drops empty ones", async () => {
    db.showcase.findMany.mockResolvedValue([{ image: "s1.jpg" }, { image: null }]);
    db.class.findMany.mockResolvedValue([{ image: "" }, { image: "c1.jpg" }]);
    db.gallery.findMany.mockResolvedValue([{ url: "g1.jpg" }]);

    await expect(maintenanceQueries.getReferencedImageUrls()).resolves.toEqual(["s1.jpg", "c1.jpg", "g1.jpg"]);
  });
});
