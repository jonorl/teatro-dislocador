import Fastify from "fastify";
import cors from "@fastify/cors";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const fastify = Fastify({ logger: true });
import { PrismaClient } from "../prisma/generated/client";

// Setup the raw Postgres connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter directly into the Prisma Client constructor
export const prisma = new PrismaClient({ adapter });

// Register Modules
fastify.register(cors, { origin: "*" }); // Adjust to your frontend domain in production
fastify.register(import("./routes/classes"), { prefix: "/api/classes" });
fastify.register(import("./routes/showcase"), { prefix: "/api/showcase" });
fastify.register(import("./routes/gallery"), { prefix: "/api/gallery" });

const start = async () => {
  try {
    // Standard port mapping matching your Caddyfile setup
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();