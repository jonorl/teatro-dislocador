const API = "https://api.teatrodislocador.ar";

// Set VITE_DATA_SOURCE=static to stop calling the server entirely and serve public/snapshot only.
const STATIC_ONLY = import.meta.env.VITE_DATA_SOURCE === "static";

const ENDPOINTS = {
  cartelera: "/api/showcase",
  classes: "/api/classes",
  galeria: "/api/gallery",
} as const;

type DataKey = keyof typeof ENDPOINTS;

let snapshot: Promise<Record<DataKey, unknown[]>> | undefined;

const loadSnapshot = () =>
  (snapshot ??= fetch("/snapshot/data.json").then((r) => {
    if (!r.ok) throw new Error(`Snapshot responded ${r.status}`);
    return r.json();
  }));

// Falls back to the snapshot so an API outage shows slightly stale content rather than empty sections.
export async function loadSiteData<T>(key: DataKey): Promise<T[]> {
  if (!STATIC_ONLY) {
    try {
      const res = await fetch(`${API}${ENDPOINTS[key]}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) return (await res.json())[key];
    } catch (e) {
      console.warn(`API unavailable for ${key}, using snapshot:`, e);
    }
  }
  return (await loadSnapshot())[key] as T[];
}
