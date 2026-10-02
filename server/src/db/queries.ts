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

  // Only shows the workflow created, so anything added by hand in the CMS is never touched.
  deleteExpired: async (now: Date) => {
    const where = { instagramId: { not: null }, endsAt: { lt: now } };
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
