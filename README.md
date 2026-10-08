# 🎭 Teatro Dislocador

A full-stack web application for Teatro Dislocador, an independent theater based in Comodoro Rivadavia, Argentina.

This project has evolved from a static site into a containerized monorepo ecosystem. It features a public client application, a secure administrative dashboard, and a robust Node.js/Prisma backend deployed via an Infrastructure-as-Code pipeline.

# 📂 Project Structure

```bash
teatro-dislocador/
├── .github/           # CI/CD Workflows (GitHub Actions)
├── admin/             # Administrative dashboard (react + vite + Clerk)
├── server/            # Backend API service (Node.js + Expres + Prisma)
└── web/               # Public-facing frontend website (React + vite)
```

# ✨ Features by Sub-Project

## Public Frontend (/web)

- Multi-section layout: Home, About Us, Artistic Direction, Current Shows, History, Classes, Gallery, and Contact.

- Dynamic Program: Live updates of shows, dates, and ticket/event details driven by the backend database.

- Interactive UI: Fully responsive navigation, custom themes with TailwindCSS, and an image gallery carousel powered by Embla Carousel.

- Integrations: Embedded Google Maps location and social media linking (Facebook, Instagram, X, TikTok).

- Static Fallback: Every build snapshots shows, classes and gallery (including images) into `web/public/snapshot/`. If the API is unreachable the site serves the snapshot instead of empty sections; setting `VITE_DATA_SOURCE=static` in Cloudflare Pages runs the site without the server at all. Refresh the committed copy with `npm run snapshot`.

## 🔐 Admin Dashboard (/admin)

  - Role-Based Access Control: Secure login restricted entirely to administrators.

  - Clerk Authentication: Managed user authentication utilizing Google OAuth exclusively.

  - Content Management (CMS): Create, read, update, and delete interfaces for handling current shows, schedules, classes, and gallery media.

## ⚙️ Backend API Service (/server)

  - ORM & Database: Powered by Prisma ORM mapping to a robust PostgreSQL 17 database instance.

  - API Engine: Fast and secure RESTful endpoints handling client data requests and authenticated admin mutations.

  - Media Engine: Dedicated uploads handling pipeline for performance assets and gallery images.

  - Machine Access: Admin routes also accept `Authorization: Bearer $AUTOMATION_TOKEN`, used by the n8n workflow below.

## 🤖 Instagram Automation (n8n)

The theatre announces everything on Instagram, so an n8n workflow (running on the personal VPS, not the Hetzner one) keeps the Cartelera and Clases in sync with its posts.

**Hourly sync**

1. Reads the Instagram token from `n8n_secrets` (Postgres, `agentic_ai` database) and fetches the latest 10 posts.
2. Skips posts already recorded in `InstagramPost` and posts without a caption.
3. Gemini classifies each caption as a new show, an update to an existing one, a class, or nothing, and extracts title, dates, description (HTML) and the event date.
4. Past events and decisions below 0.7 confidence are skipped.
5. The image is re-hosted through `/api/upload` (photo, first carousel slide, or the reel's cover thumbnail; saved without an image if Instagram withholds it), then the show or class is created or updated with its `instagramId` and `endsAt`.
6. Every decision, applied or skipped, is recorded via `/api/instagram/processed`, and a summary is sent to WhatsApp.

**Daily (04:00, Argentina time)**

- `POST /api/instagram/expire-shows` removes Instagram shows 30 days after the show (`endsAt`), and any show without an end date that hasn't been edited for 30 days. Re-saving an undated show in the CMS keeps it up for another 30 days.
- `POST /api/maintenance/cleanup-uploads` deletes files in the uploads folder that no show, class or gallery entry references, once they are older than 7 days (the CMS uploads an image before the entry is saved).
- A Cloudflare Pages deploy hook rebuilds the site so the static snapshot stays current.

**Weekly (Mondays)**

- Refreshes the long-lived Instagram token (valid 60 days) and stores the new one. The account owner only needs to re-authorise if the token is revoked, e.g. after an Instagram password change or if the refresh fails for 60 days.

**Automation endpoints** (all require the bearer token)

| Endpoint | Purpose |
|---|---|
| `GET /api/instagram/processed` | Last 200 processed post IDs, for de-duplication |
| `POST /api/instagram/processed` | Records `{ id, decision }` for a post |
| `POST /api/instagram/expire-shows` | Removes expired shows and returns their titles |
| `POST /api/maintenance/cleanup-uploads` | Lists unused uploaded images; deletes them only with `{ "dryRun": false }` |

**Re-authorising Instagram** (only if the token stops working)

1. The account owner opens `https://www.instagram.com/oauth/authorize?client_id=1075439172000283&redirect_uri=https://teatrodislocador.ar/&response_type=code&scope=instagram_business_basic`, taps "Permitir" and sends back the URL they land on.
2. Within an hour, exchange the `code` for a short-lived token (`POST https://api.instagram.com/oauth/access_token`), then for a 60-day token (`GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token`). Both need the Instagram app secret from the Meta dashboard.
3. Store it: `UPDATE n8n_secrets SET value = '<token>' WHERE key = 'dislocador_ig_token';`

# 🛠️ Tech Stack

## Frontend & Admin

  - Framework: React 19 + TypeScript + Vite

  - Styling: TailwindCSS + shadcn/ui components

  - Auth: Clerk (Google Identity Provider)

## Backend & Data

  - Runtime: Node.js

  - Database: PostgreSQL 17

  - ORM: Prisma

## DevOps & Infrastructure

  - Hosting: Virtual Private Server (VPS)

  - Reverse Proxy: Caddy Server handling automated SSL/TLS certificates and routing traffic.

  - Containerization: Docker and Docker Compose configurations for cross-service orchestration.

  - CI/CD: Automated builds pushing private production server images directly to the GitHub Container Registry (ghcr.io).

  - Observability & Ops: Complete system insights powered by Git-tracked Infrastructure as Code, continuous automated database backups, and full-stack monitoring metrics.

  - Monitoring: Grafana + Prometheus dashboards.

# 📦 Installation & Setup

## Prerequisites

Ensure you have node (v22+ recommended) and docker installed on your machine.

## Setup

- Clone the repo:

```bash
git clone https://github.com/jonorl/teatro-dislocador.git
cd teatro-dislocador
```
## Environment configurations:

- Create a .env file inside /admin, /server, and /web directories matching the structure required for Clerk API keys, database connection URIs, and server ports (use .env.template as reference).

- In production, the server's `.env` also needs `AUTOMATION_TOKEN` (generate with `openssl rand -hex 32`); the same value goes into n8n's "Dislocador automation token" credential.

- Schema changes go through Prisma migrations only. On prod, apply them through an SSH tunnel to the Hetzner Postgres with `npx prisma migrate deploy`, **before** pushing code that depends on them.

- Install dependencies per application layer

```bash
# Example for the backend server
cd server && npm install

# Example for the public web frontend
cd ../web && npm install
```

## Execution

To run services locally for development:

- Backend: ```cd server && npx tsx src/app.ts```
- Public web: ```cd web && npm run dev```
- Admin CRM: ```cd admin && npm run dev```

👨‍💻 Author
Developed by Jonathan Orlowski – All rights reserved.