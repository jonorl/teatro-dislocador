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

## 🔐 Admin Dashboard (/admin)

  - Role-Based Access Control: Secure login restricted entirely to administrators.

  - Clerk Authentication: Managed user authentication utilizing Google OAuth exclusively.

  - Content Management (CMS): Create, read, update, and delete interfaces for handling current shows, schedules, classes, and gallery media.

## ⚙️ Backend API Service (/server)

  - ORM & Database: Powered by Prisma ORM mapping to a robust PostgreSQL 17 database instance.

  - API Engine: Fast and secure RESTful endpoints handling client data requests and authenticated admin mutations.

  - Media Engine: Dedicated uploads handling pipeline for performance assets and gallery images.

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