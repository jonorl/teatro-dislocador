import { Prisma } from "@prisma/client";
import { prisma } from "../app";

// --- Classes Queries ---
export const classQueries = {
  getAll: () => 
    prisma.class.findMany({ orderBy: { createdAt: "desc" } }),

  create: (data: { title: string; description?: string; schedule: string; image?: string; instagramId?: string }) =>
    prisma.class.create({ data }),

  update: (id: string, data: { title?: string; description?: string; schedule?: string; image?: string; instagramId?: string }) =>
    prisma.class.update({ where: { id }, data }),

  delete: (id: string) => 
    prisma.class.delete({ where: { id } }),
};

// --- Gallery Queries ---
export const galleryQueries = {
  getAll: () => 
    prisma.gallery.findMany({ orderBy: { createdAt: "desc" } }),

  create: (url: string) => 
    prisma.gallery.create({ data: { url } }),

  getById: (id: string) =>
    prisma.gallery.findUnique({ where: { id } }),

  delete: (id: string) => 
    prisma.gallery.delete({ where: { id } }),
};

// --- Showcase Queries ---
export interface ShowcaseData {
  title: string;
  dates: string;
  image: string;
  author?: string;
  director?: string;
  duration?: string;
  description?: string;
  instagramId?: string;
  endsAt?: Date;
}

export const showcaseQueries = {
  getAll: () => 
    prisma.showcase.findMany({ orderBy: { createdAt: "desc" } }),

  create: (data: ShowcaseData) => 
    prisma.showcase.create({ data }),

  update: (id: string, data: Partial<ShowcaseData>) => 
    prisma.showcase.update({ where: { id }, data }),

  delete: (id: string) => 
    prisma.showcase.delete({ where: { id } }),

  // Shows stay listed for a month after they happen. Instagram shows carry a real end date; shows without one
  // (CMS entries, undated posts) have free-text dates the server can't parse, so the month counts from their last edit.
  deleteExpired: async (now: Date) => {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const where = {
      OR: [
        { instagramId: { not: null }, endsAt: { lt: monthAgo } },
        { endsAt: null, updatedAt: { lt: monthAgo } },
      ],
    };
    const expired = await prisma.showcase.findMany({ where, select: { id: true, title: true } });
    await prisma.showcase.deleteMany({ where: { id: { in: expired.map((s) => s.id) } } });
    return expired;
  },
};

// --- Instagram Queries ---
export const instagramQueries = {
  getRecentIds: (limit: number) =>
    prisma.instagramPost.findMany({ select: { id: true }, orderBy: { createdAt: "desc" }, take: limit }),

  record: (id: string, decision: Prisma.InputJsonValue) =>
    prisma.instagramPost.upsert({ where: { id }, create: { id, decision }, update: { decision } }),
};

// --- Maintenance Queries ---
export const maintenanceQueries = {
  // Every image URL the site still points at, across all tables that store one.
  getReferencedImageUrls: async () => {
    const [shows, classes, gallery] = await Promise.all([
      prisma.showcase.findMany({ select: { image: true } }),
      prisma.class.findMany({ select: { image: true } }),
      prisma.gallery.findMany({ select: { url: true } }),
    ]);
    return [...shows.map((s) => s.image), ...classes.map((c) => c.image), ...gallery.map((g) => g.url)]
      .filter((url): url is string => Boolean(url));
  },
};
