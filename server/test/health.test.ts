import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import request from "supertest";
import { healthQueries } from "../src/db/queries";
import router, { resetHealthCache } from "../src/routes/health";
import { appWith } from "./helpers";

jest.mock("../src/db/queries", () => ({ healthQueries: { ping: jest.fn() } }));

const ping = jest.mocked(healthQueries.ping);
const app = appWith("/health", router);

beforeEach(() => {
  resetHealthCache();
  process.env.GIT_SHA = "abc1234";
});

afterEach(() => {
  jest.useRealTimers();
  delete process.env.GIT_SHA;
});

describe("GET /health", () => {
  it("reports ok and the build's commit when the database answers", async () => {
    ping.mockResolvedValue([{ "?column?": 1 }] as any);
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", database: "ok", version: "abc1234" });
  });

  it("answers 503 when the database is unreachable", async () => {
    ping.mockRejectedValue(new Error("Can't reach database server"));
    const res = await request(app).get("/health");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: "error", database: "unreachable", version: "abc1234" });
  });

  it("says dev when the image was built without a commit", async () => {
    delete process.env.GIT_SHA;
    ping.mockResolvedValue([] as any);
    expect((await request(app).get("/health")).body.version).toBe("dev");
  });

  it("checks the database at most once every 5 seconds", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    ping.mockResolvedValue([] as any);

    await request(app).get("/health");
    await request(app).get("/health");
    expect(ping).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    await request(app).get("/health");
    expect(ping).toHaveBeenCalledTimes(2);
  });

  it("notices recovery once the cached failure expires", async () => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    ping.mockRejectedValueOnce(new Error("down")).mockResolvedValue([] as any);

    expect((await request(app).get("/health")).status).toBe(503);
    jest.advanceTimersByTime(5000);
    expect((await request(app).get("/health")).status).toBe(200);
  });
});
