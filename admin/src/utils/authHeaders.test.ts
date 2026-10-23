import { describe, it, expect } from "@jest/globals";
import authHeaders from "./authHeaders";

describe("authHeaders", () => {
  it("sends JSON with the bearer token by default", () => {
    expect(authHeaders("tok")).toEqual({ Authorization: "Bearer tok", "Content-Type": "application/json" });
  });

  it("omits Content-Type for multipart so the browser can set the boundary", () => {
    expect(authHeaders("tok", true)).toEqual({ Authorization: "Bearer tok" });
  });
});
