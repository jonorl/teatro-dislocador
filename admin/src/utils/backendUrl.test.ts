import { describe, it, expect } from "@jest/globals";
import backendUrl from "./backendUrl";

const env = (overrides: Partial<ImportMetaEnv>) =>
  ({
    MODE: "development",
    PROD: false,
    VITE_DISLOCADOR_PROD_BACKEND: "https://api.prod/api",
    VITE_DISLOCADOR_DEV_BACKEND: "http://localhost:3000/api",
    ...overrides,
  }) as ImportMetaEnv;

describe("backendUrl", () => {
  it("uses the dev backend under vite dev", () => {
    expect(backendUrl(env({}))).toBe("http://localhost:3000/api");
  });

  it("uses the prod backend in a production build", () => {
    expect(backendUrl(env({ MODE: "production", PROD: true }))).toBe("https://api.prod/api");
  });

  it("uses the prod backend when run with --mode PROD", () => {
    expect(backendUrl(env({ MODE: "PROD" }))).toBe("https://api.prod/api");
  });
});
