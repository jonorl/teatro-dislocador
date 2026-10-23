import cors from "cors";

// Only the browsers need this: n8n and the snapshot script call the API server-side, where CORS doesn't apply.
const ALLOWED = [
  "https://teatrodislocador.ar",
  "https://admin.teatrodislocador.ar",
  // Cloudflare Pages previews of the site and the CRM; only this account can publish under these names.
  /^https:\/\/([a-z0-9]+\.)?teatro-dislocador(-crm)?\.pages\.dev$/,
];

const LOCAL_DEV = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export const corsMiddleware = () =>
  cors({ origin: process.env.NODE_ENV === "development" ? [...ALLOWED, LOCAL_DEV] : ALLOWED });
