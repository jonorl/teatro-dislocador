import { jest, describe, it, expect, beforeEach, afterEach } from "@jest/globals";

const API = "https://api.teatrodislocador.ar";
const SNAPSHOT = {
  cartelera: [{ id: "snap-show" }],
  classes: [{ id: "snap-class" }],
  galeria: [{ id: "snap-image" }],
};

const respond = (body: unknown, status = 200) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) } as Response);

const fetchMock = jest.fn<typeof fetch>();

// siteData caches the snapshot and reads VITE_DATA_SOURCE at import time, so each test loads a fresh copy.
const load = async () => (await import("./siteData")).loadSiteData;

beforeEach(() => {
  jest.resetModules();
  globalThis.fetch = fetchMock;
  jest.spyOn(console, "warn").mockImplementation(() => {});
  fetchMock.mockImplementation((input) =>
    String(input) === "/snapshot/data.json" ? respond(SNAPSHOT) : respond({ cartelera: [{ id: "live-show" }] }),
  );
});

afterEach(() => {
  delete process.env.VITE_DATA_SOURCE;
});

describe("loadSiteData", () => {
  it("returns the API's data when it responds", async () => {
    const loadSiteData = await load();
    await expect(loadSiteData("cartelera")).resolves.toEqual([{ id: "live-show" }]);
    expect(fetchMock).toHaveBeenCalledWith(`${API}/api/showcase`, expect.anything());
    expect(fetchMock).not.toHaveBeenCalledWith("/snapshot/data.json");
  });

  it("falls back to the snapshot when the API errors", async () => {
    fetchMock.mockImplementation((input) =>
      String(input) === "/snapshot/data.json" ? respond(SNAPSHOT) : respond({ error: "down" }, 502),
    );
    const loadSiteData = await load();
    await expect(loadSiteData("classes")).resolves.toEqual([{ id: "snap-class" }]);
  });

  it("falls back to the snapshot when the API is unreachable", async () => {
    fetchMock.mockImplementation((input) =>
      String(input) === "/snapshot/data.json" ? respond(SNAPSHOT) : Promise.reject(new TypeError("Failed to fetch")),
    );
    const loadSiteData = await load();
    await expect(loadSiteData("galeria")).resolves.toEqual([{ id: "snap-image" }]);
    expect(console.warn).toHaveBeenCalled();
  });

  it("downloads the snapshot once for all sections", async () => {
    fetchMock.mockImplementation((input) =>
      String(input) === "/snapshot/data.json" ? respond(SNAPSHOT) : Promise.reject(new TypeError("Failed to fetch")),
    );
    const loadSiteData = await load();
    await Promise.all([loadSiteData("cartelera"), loadSiteData("classes"), loadSiteData("galeria")]);
    expect(fetchMock.mock.calls.filter(([input]) => input === "/snapshot/data.json")).toHaveLength(1);
  });

  it("rejects when both the API and the snapshot fail", async () => {
    fetchMock.mockImplementation((input) =>
      String(input) === "/snapshot/data.json" ? respond({}, 404) : respond({}, 500),
    );
    const loadSiteData = await load();
    await expect(loadSiteData("cartelera")).rejects.toThrow("Snapshot responded 404");
  });

  it("never calls the API when VITE_DATA_SOURCE is static", async () => {
    process.env.VITE_DATA_SOURCE = "static";
    const loadSiteData = await load();
    await expect(loadSiteData("cartelera")).resolves.toEqual([{ id: "snap-show" }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/snapshot/data.json");
  });
});
