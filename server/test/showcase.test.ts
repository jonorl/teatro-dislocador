import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { showcaseQueries } from "../src/db/queries";
import router from "../src/routes/showcase";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/db/queries", () => ({
  showcaseQueries: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
}));

const queries = jest.mocked(showcaseQueries);
const app = appWith("/api/showcase", router);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/showcase", () => {
  it("wraps the shows in a cartelera key", async () => {
    queries.getAll.mockResolvedValue([{ id: "1", title: "Hamlet" }] as any);
    const res = await request(app).get("/api/showcase");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ cartelera: [{ id: "1", title: "Hamlet" }] });
  });

  it("returns 500 when the database fails", async () => {
    queries.getAll.mockRejectedValue(new Error("db down"));
    const res = await request(app).get("/api/showcase");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/showcase", () => {
  it("rejects a show without a title", async () => {
    const res = await request(app).post("/api/showcase").send({ dates: "Viernes" });
    expect(res.status).toBe(400);
    expect(queries.create).not.toHaveBeenCalled();
  });

  it("rejects an endsAt that is not a date", async () => {
    const res = await request(app).post("/api/showcase").send({ title: "Hamlet", endsAt: "next friday" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/endsAt/);
    expect(queries.create).not.toHaveBeenCalled();
  });

  it("stores endsAt as a Date", async () => {
    queries.create.mockResolvedValue({ id: "1" } as any);
    const res = await request(app)
      .post("/api/showcase")
      .send({ title: "Hamlet", dates: "Viernes 21hs", endsAt: "2026-11-01T21:00:00-03:00" });
    expect(res.status).toBe(201);
    const data = queries.create.mock.calls[0][0];
    expect(data.endsAt).toEqual(new Date("2026-11-02T00:00:00Z"));
  });

  it.each([undefined, null, ""])("leaves endsAt unset when it is %p", async (endsAt) => {
    queries.create.mockResolvedValue({ id: "1" } as any);
    await request(app).post("/api/showcase").send({ title: "Hamlet", endsAt });
    expect(queries.create.mock.calls[0][0].endsAt).toBeUndefined();
  });

  it("ignores fields the model does not have", async () => {
    queries.create.mockResolvedValue({ id: "1" } as any);
    await request(app).post("/api/showcase").send({ title: "Hamlet", id: "forged", createdAt: "2000-01-01" });
    const data = queries.create.mock.calls[0][0] as unknown as Record<string, unknown>;
    expect(data).not.toHaveProperty("id");
    expect(data).not.toHaveProperty("createdAt");
  });
});

describe("PUT /api/showcase/:id", () => {
  it("updates the show with the given id", async () => {
    queries.update.mockResolvedValue({ id: "abc", title: "Nuevo" } as any);
    const res = await request(app).put("/api/showcase/abc").send({ title: "Nuevo" });
    expect(res.status).toBe(200);
    expect(queries.update).toHaveBeenCalledWith("abc", expect.objectContaining({ title: "Nuevo" }));
  });

  it("rejects an invalid endsAt", async () => {
    const res = await request(app).put("/api/showcase/abc").send({ endsAt: "nope" });
    expect(res.status).toBe(400);
    expect(queries.update).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/showcase/:id", () => {
  it("returns 204", async () => {
    queries.delete.mockResolvedValue({} as any);
    const res = await request(app).delete("/api/showcase/abc");
    expect(res.status).toBe(204);
    expect(queries.delete).toHaveBeenCalledWith("abc");
  });

  it("returns 500 when the show does not exist", async () => {
    queries.delete.mockRejectedValue(new Error("Record not found"));
    const res = await request(app).delete("/api/showcase/missing");
    expect(res.status).toBe(500);
  });
});
