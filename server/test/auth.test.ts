import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import express from "express";
import request from "supertest";
import { getAuth, clerkClient } from "@clerk/express";
import { authenticateAdmin } from "../src/middleware/auth";

jest.mock("@clerk/express", () => ({
  getAuth: jest.fn(),
  clerkClient: { users: { getUser: jest.fn() } },
}));

const mockedGetAuth = jest.mocked(getAuth);
const getUser = jest.mocked(clerkClient.users.getUser);

const app = express();
app.get("/admin", authenticateAdmin, (_req, res) => res.json({ ok: true }));

const call = (headers: Record<string, string> = {}) =>
  request(app).get("/admin").set({ Host: "api.teatrodislocador.ar", ...headers });

const userWithEmail = (email?: string) =>
  ({ emailAddresses: email ? [{ emailAddress: email }] : [] }) as any;

beforeEach(() => {
  process.env.AUTOMATION_TOKEN = "secret-token";
  mockedGetAuth.mockReturnValue({ userId: null } as any);
});

afterEach(() => {
  delete process.env.AUTOMATION_TOKEN;
});

describe("authenticateAdmin", () => {
  it("lets everything through when NODE_ENV is development", async () => {
    process.env.NODE_ENV = "development";
    try {
      const res = await call();
      expect(res.status).toBe(200);
      expect(mockedGetAuth).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = "test";
    }
  });

  it.each(["localhost", "127.0.0.1", "localhost:3000"])("does not trust a Host header of %s", async (host) => {
    const res = await request(app).get("/admin").set("Host", host);
    expect(res.status).toBe(401);
  });

  it("accepts the automation token", async () => {
    const res = await call({ Authorization: "Bearer secret-token" });
    expect(res.status).toBe(200);
    expect(mockedGetAuth).not.toHaveBeenCalled();
  });

  it("falls back to Clerk for a wrong token", async () => {
    const res = await call({ Authorization: "Bearer wrong" });
    expect(res.status).toBe(401);
  });

  it("does not accept an empty token when AUTOMATION_TOKEN is unset", async () => {
    delete process.env.AUTOMATION_TOKEN;
    const res = await call({ Authorization: "Bearer " });
    expect(res.status).toBe(401);
  });

  it("returns 401 without a Clerk session", async () => {
    const res = await call();
    expect(res.status).toBe(401);
  });

  it("returns 403 for a signed-in user who is not an admin", async () => {
    mockedGetAuth.mockReturnValue({ userId: "user_1" } as any);
    getUser.mockResolvedValue(userWithEmail("someone@example.com"));
    const res = await call();
    expect(res.status).toBe(403);
  });

  it("returns 403 for a user without an email address", async () => {
    mockedGetAuth.mockReturnValue({ userId: "user_1" } as any);
    getUser.mockResolvedValue(userWithEmail());
    const res = await call();
    expect(res.status).toBe(403);
  });

  it("lets an admin through", async () => {
    mockedGetAuth.mockReturnValue({ userId: "user_1" } as any);
    getUser.mockResolvedValue(userWithEmail("teatro.dislocador@gmail.com"));
    const res = await call();
    expect(res.status).toBe(200);
    expect(getUser).toHaveBeenCalledWith("user_1");
  });

  it("returns 500 when Clerk fails", async () => {
    mockedGetAuth.mockReturnValue({ userId: "user_1" } as any);
    getUser.mockRejectedValue(new Error("Clerk down"));
    const res = await call();
    expect(res.status).toBe(500);
  });
});
