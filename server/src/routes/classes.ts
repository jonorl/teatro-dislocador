import { FastifyInstance } from "fastify";
import { prisma } from "../app";

export default async function classRoutes(fastify: FastifyInstance) {
  // Public GET for the user-facing landing page
  fastify.get("/", async (request, reply) => {
    const classes = await prisma.class.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { classes };
  });

  // CMS Endpoints
  fastify.post("/", async (request, reply) => {
    const { title, description, schedule } = request.body as any;
    const newClass = await prisma.class.create({
      data: { title, description, schedule },
    });
    return reply.status(201).send(newClass);
  });

  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { title, description, schedule } = request.body as any;
    const updated = await prisma.class.update({
      where: { id: Number(id) },
      data: { title, description, schedule },
    });
    return updated;
  });

  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.class.delete({ where: { id: Number(id) } });
    return reply.status(204).send();
  });
}