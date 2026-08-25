# MAZAD 🔨 — Real-Time Auction Platform

A car auction platform built as **event-driven .NET microservices** with a **Next.js** frontend. Users create auctions, place bids, and see other people's bids appear **live** — no page refresh — via SignalR.

> **Mazad (مزاد)** means *auction* in Arabic.

<!-- Add a screenshot or demo GIF here:
![MAZAD demo](docs/demo.gif)
-->

## 🌐 Live Demo (Not Deployed yet)

| | URL |
|---|---|
| **App** | https://app.mazad.duckdns.org |
| API Gateway | https://api.mazad.duckdns.org/search |
| Identity Server | https://id.mazad.duckdns.org |

**Demo accounts** (or register your own): username `alice` or `bob`, password `Pass123$`

> Hosted on an Oracle Cloud Always Free ARM VM — see [DEPLOYMENT.md](DEPLOYMENT.md) for the full setup.

## ▶️ Run It Yourself

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [Node.js 20+](https://nodejs.org).

**1. Start the backend** (6 services + PostgreSQL + MongoDB + RabbitMQ):

```bash
git clone https://github.com/Youssefhikal93/.NET-NEXT---MAZAD.git mazad
cd mazad
docker compose up -d --build
```

The first build takes a few minutes. Verify with `docker compose ps` (9 containers) or
`curl http://localhost:6001/search` — it should return seeded auctions as JSON.

**2. Configure the frontend** — NextAuth needs one secret to encrypt session cookies.
Create `frontend/web-app/.env.local` containing a single line (any long random string works):

```bash
cd frontend/web-app
npx auth secret   # generates .env.local with a random AUTH_SECRET for you
```

**3. Start the frontend:**

```bash
npm install
npm run dev
```

**4. Try it:** open **http://localhost:3000**

- Log in as `bob` / `Pass123$` (the login page is served by the Identity Server on `localhost:5001`)
- Open an auction and place a bid
- Open a second browser (or incognito window), log in as `alice` / `Pass123$`, and watch bids
  and new auctions appear **live** — that's SignalR pushing events end-to-end through
  RabbitMQ → Notification Service → Gateway → browser.

**Troubleshooting**

| Symptom | Fix |
|---|---|
| Auction list is empty on very first boot | `docker compose restart search-svc` — the search index syncs from the auction service, which may still have been seeding |
| `MissingSecret` error in the frontend console | Step 2 was skipped — create `.env.local` and restart `npm run dev` |
| `EADDRINUSE :::3000` | Another dev server is already running on port 3000 — stop it first |

## 🏗 Architecture

Six independent services communicate asynchronously over RabbitMQ, with gRPC for the one synchronous cross-service call:

```mermaid
flowchart LR
    Browser((Browser)) --> Web[Next.js Web App]
    Browser -- SignalR --> GW
    Web --> GW[Gateway<br/>YARP Reverse Proxy]
    GW --> AUC[Auction Service<br/>PostgreSQL]
    GW --> SRCH[Search Service<br/>MongoDB]
    GW --> BID[Bidding Service<br/>MongoDB]
    GW --> NOTIF[Notification Service<br/>SignalR Hub]
    Web -- OIDC --> ID[Identity Service<br/>Duende IdentityServer<br/>PostgreSQL]
    BID -- gRPC --> AUC
    AUC <-- events --> MQ{{RabbitMQ}}
    SRCH <-- events --> MQ
    BID <-- events --> MQ
    NOTIF <-- events --> MQ
```

| Service | Responsibility | Tech |
|---|---|---|
| **Auction** | Auction lifecycle, source of truth | .NET 9, EF Core, PostgreSQL, gRPC server |
| **Search** | Fast full-text search over auctions | .NET 9, MongoDB, consumes auction events |
| **Bidding** | Bid placement & validation, auction finishing | .NET 9, MongoDB, gRPC client |
| **Notification** | Pushes bids/auctions to browsers in real time | .NET 9, SignalR |
| **Identity** | Authentication & tokens (OIDC) | .NET 8, Duende IdentityServer, ASP.NET Identity |
| **Gateway** | Single public API entry, routing, CORS, authz | .NET 9, YARP |
| **Web App** | UI with SSR and live updates | Next.js 15, React 19, NextAuth, Tailwind, Zustand |

**Patterns demonstrated:** event-driven communication (MassTransit + RabbitMQ), database-per-service (PostgreSQL + MongoDB), API gateway, OIDC auth flow, gRPC, real-time push, outbox-style resilience (messages survive service restarts), containerized multi-arch builds (x64 + ARM64).

## 🧪 Tests

```bash
dotnet test
```

Unit and integration tests for the auction service live in `tests/` (`AuctionService.UnitTests`, `AuctionService.Integrationtest`).

## 🚀 Deployment

The whole system runs on a single free-tier VM behind a Caddy reverse proxy with automatic HTTPS.
See **[DEPLOYMENT.md](DEPLOYMENT.md)** — including multi-arch image builds, DuckDNS setup, and the production compose file.

## 📁 Repository Layout

```
├── src/                  # the six .NET services
├── frontend/web-app/     # Next.js frontend
├── tests/                # unit & integration tests
├── docker-compose.yaml   # local development stack
├── docker-compose.prod.yaml  # production stack (with Caddy TLS)
└── deploy/               # Caddyfile + multi-arch build script
```
