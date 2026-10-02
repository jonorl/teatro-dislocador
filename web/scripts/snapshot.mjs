// Copies the API's content and images into public/snapshot so the site can run without the server.
// If the API is unreachable, the committed snapshot is left untouched rather than replaced with nothing.
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API = process.env.SNAPSHOT_API ?? "https://api.teatrodislocador.ar";
const OUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/snapshot");
const TMP_DIR = `${OUT_DIR}.tmp`;

const getJson = async (endpoint) => {
  const res = await fetch(`${API}${endpoint}`, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`${endpoint} responded ${res.status}`);
  return res.json();
};

// Hashing the URL keeps file names stable between runs and avoids collisions across hosts.
const localName = (url) => {
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  return `${createHash("sha1").update(url).digest("hex").slice(0, 16)}${ext}`;
};

const downloaded = new Map();
const localise = async (url) => {
  if (!url) return url;
  if (!downloaded.has(url)) {
    downloaded.set(url, (async () => {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`${url} responded ${res.status}`);
      const name = localName(url);
      await writeFile(path.join(TMP_DIR, "images", name), Buffer.from(await res.arrayBuffer()));
      return `/snapshot/images/${name}`;
    })());
  }
  return downloaded.get(url);
};

const main = async () => {
  const [{ cartelera }, { classes }, { galeria }] = await Promise.all([
    getJson("/api/showcase"),
    getJson("/api/classes"),
    getJson("/api/gallery"),
  ]);

  await rm(TMP_DIR, { recursive: true, force: true });
  await mkdir(path.join(TMP_DIR, "images"), { recursive: true });

  const data = {
    generatedAt: new Date().toISOString(),
    cartelera: await Promise.all(cartelera.map(async (s) => ({ ...s, image: await localise(s.image) }))),
    classes: await Promise.all(classes.map(async (c) => ({ ...c, image: await localise(c.image) }))),
    galeria: await Promise.all(galeria.map(async (g) => ({ ...g, url: await localise(g.url) }))),
  };
  await writeFile(path.join(TMP_DIR, "data.json"), JSON.stringify(data, null, 2));

  // Swap only once everything downloaded, so a half-failed run never leaves a broken snapshot.
  await rm(OUT_DIR, { recursive: true, force: true });
  await rename(TMP_DIR, OUT_DIR);
  console.log(`Snapshot: ${cartelera.length} shows, ${classes.length} classes, ${galeria.length} gallery images, ${downloaded.size} files.`);
};

main().catch(async (error) => {
  await rm(TMP_DIR, { recursive: true, force: true });
  console.warn(`Snapshot skipped, keeping the existing one: ${error.message}`);
});
