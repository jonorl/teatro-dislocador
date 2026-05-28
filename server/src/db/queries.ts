import { prisma } from "../app";

// --- Classes Queries ---
export const classQueries = {
  getAll: () => 
    prisma.class.findMany({ orderBy: { createdAt: "desc" } }),

  create: (data: { title: string; description?: string; schedule: string }) => 
    prisma.class.create({ data }),

  update: (id: string, data: { title?: string; description?: string; schedule?: string }) => 
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
};