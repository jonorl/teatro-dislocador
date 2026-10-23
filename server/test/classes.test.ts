import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { classQueries } from "../src/db/queries";
import router from "../src/routes/classes";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/db/queries", () => ({
  classQueries: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
}));

const queries = jest.mocked(classQueries);
const app = appWith("/api/classes", router);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("classes routes", () => {
  it("lists classes under a classes key", async () => {
    queries.getAll.mockResolvedValue([{ id: "1", title: "Iniciación" }] as any);
    const res = await request(app).get("/api/classes");
    expect(res.body).toEqual({ classes: [{ id: "1", title: "Iniciación" }] });
  });

  it("creates a class from the allowed fields only", async () => {
    queries.create.mockResolvedValue({ id: "1" } as any);
    const res = await request(app)
      .post("/api/classes")
      .send({ title: "Iniciación", schedule: "Lunes 19hs", description: "<p>Hola</p>", id: "forged" });
    expect(res.status).toBe(201);
    expect(queries.create).toHaveBeenCalledWith({
      title: "Iniciación",
      schedule: "Lunes 19hs",
      description: "<p>Hola</p>",
      image: undefined,
      instagramId: undefined,
    });
  });

  it("returns 500 when Prisma rejects the class", async () => {
    queries.create.mockRejectedValue(new Error("Argument `schedule` is missing."));
    const res = await request(app).post("/api/classes").send({ title: "Sin horario" });
    expect(res.status).toBe(500);
  });

  it("updates by id", async () => {
    queries.update.mockResolvedValue({ id: "abc" } as any);
    await request(app).put("/api/classes/abc").send({ schedule: "Martes" });
    expect(queries.update).toHaveBeenCalledWith("abc", expect.objectContaining({ schedule: "Martes" }));
  });

  it("deletes by id", async () => {
    queries.delete.mockResolvedValue({} as any);
    const res = await request(app).delete("/api/classes/abc");
    expect(res.status).toBe(204);
    expect(queries.delete).toHaveBeenCalledWith("abc");
  });
});
