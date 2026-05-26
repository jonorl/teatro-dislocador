import { FastifyInstance } from "fastify";
import { prisma } from "../app.js";

export default async function showcaseRoutes(fastify: FastifyInstance) {
  // Public GET for the frontend component
  fastify.get("/", async (request, reply) => {
    const cartelera = await prisma.showcase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { cartelera };
  });

  // CMS: Create new show
  fastify.post("/", async (request, reply) => {
    const { title, author, director, dates, duration, description, image } = request.body as any;
    const show = await prisma.showcase.create({
      data: { title, author, director, dates, duration, description, image },
    });
    return reply.status(201).send(show);
  });

  // CMS: Update show
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, author, director, dates, duration, description, image } = request.body as any;
    const updated = await prisma.showcase.update({
      where: { id: Number(id) },
      data: { title, author, director, dates, duration, description, image },
    });
    return updated;
  });

  // CMS: Delete show
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.showcase.delete({ where: { id: Number(id) } });
    return reply.status(204).send();
  });
}