import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { instagramQueries, showcaseQueries } from "../src/db/queries";
import router from "../src/routes/instagram";
import { appWith } from "./helpers";

jest.mock("../src/middleware/auth", () => ({ authenticateAdmin: (_req: any, _res: any, next: any) => next() }));
jest.mock("../src/db/queries", () => ({
  instagramQueries: { getRecentIds: jest.fn(), record: jest.fn() },
  showcaseQueries: { deleteExpired: jest.fn() },
}));

const instagram = jest.mocked(instagramQueries);
const showcase = jest.mocked(showcaseQueries);
const app = appWith("/api/instagram", router);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/instagram/processed", () => {
  it("returns the last 200 ids as a flat list", async () => {
    instagram.getRecentIds.mockResolvedValue([{ id: "a" }, { id: "b" }]);
    const res = await request(app).get("/api/instagram/processed");
    expect(instagram.getRecentIds).toHaveBeenCalledWith(200);
    expect(res.body).toEqual({ ids: ["a", "b"] });
  });
});

describe("POST /api/instagram/processed", () => {
  it.each([[{ decision: "skip" }], [{ id: "1" }]])("requires id and decision (%j)", async (body) => {
    const res = await request(app).post("/api/instagram/processed").send(body);
    expect(res.status).toBe(400);
    expect(instagram.record).not.toHaveBeenCalled();
  });

  it("accepts falsy decisions and stringifies numeric ids", async () => {
    instagram.record.mockResolvedValue({} as any);
    const res = await request(app).post("/api/instagram/processed").send({ id: 17895, decision: false });
    expect(res.status).toBe(201);
    expect(instagram.record).toHaveBeenCalledWith("17895", false);
  });
});

describe("POST /api/instagram/expire-shows", () => {
  it("returns the removed shows", async () => {
    showcase.deleteExpired.mockResolvedValue([{ id: "1", title: "Hamlet" }]);
    const res = await request(app).post("/api/instagram/expire-shows");
    expect(res.body).toEqual({ removed: [{ id: "1", title: "Hamlet" }] });
    expect(showcase.deleteExpired.mock.calls[0][0]).toBeInstanceOf(Date);
  });

  it("returns 500 when the query fails", async () => {
    showcase.deleteExpired.mockRejectedValue(new Error("db down"));
    const res = await request(app).post("/api/instagram/expire-shows");
    expect(res.status).toBe(500);
  });
});
