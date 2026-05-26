import { FastifyInstance } from "fastify";
import { prisma } from "../app.js";

export default async function galleryRoutes(fastify: FastifyInstance) {
  // Public GET matching frontend image.URL mapper
  fastify.get("/", async (request, reply) => {
    const galleryItems = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Formats payload structure to map cleanly onto your frontend's item.URL layout
    const galeria = galleryItems.map(item => ({
      URL: item.url
    }));
    
    return { galeria };
  });

  // CMS: Add image URL
  fastify.post("/", async (request, reply) => {
    const { url } = request.body as { url: string };
    const newImage = await prisma.gallery.create({ data: { url } });
    return reply.status(201).send(newImage);
  });

  // CMS: Delete image
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.gallery.delete({ where: { id: Number(id) } });
    return reply.status(204).send();
  });
}