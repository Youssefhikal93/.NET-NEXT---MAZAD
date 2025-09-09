## Mazadak - Local Development with Docker

A full-stack auction platform composed of multiple .NET services, a Next.js web app, and supporting infrastructure (PostgreSQL, MongoDB, RabbitMQ, nginx-proxy). This guide helps you run everything locally using Docker on Windows, macOS, or Linux.

### Prerequisites

- **Docker Desktop** (with WSL2 backend on Windows)
- **Git**
- Optional: **Make** (for convenience) and a terminal with `bash` or PowerShell

### Hostname setup (recommended)

The stack uses virtual hosts behind `nginx-proxy`. Add these entries to your hosts file so friendly URLs work:

- `app.mazad.se` → Next.js app
- `api.mazad.se` → API Gateway
- `id.mazad.se` → IdentityServer

Windows (PowerShell run as Administrator):

```powershell
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "`n127.0.0.1`tapp.mazad.se"; \
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "`n127.0.0.1`tapi.mazad.se"; \
Add-Content -Path C:\Windows\System32\drivers\etc\hosts -Value "`n127.0.0.1`tid.mazad.se"
```

macOS/Linux:

```bash
echo "127.0.0.1 app.mazad.se" | sudo tee -a /etc/hosts
echo "127.0.0.1 api.mazad.se" | sudo tee -a /etc/hosts
echo "127.0.0.1 id.mazad.se"  | sudo tee -a /etc/hosts
```

If you skip this step, you can still use port URLs (see Access URLs).

### Quick start

From the repository root:

```bash
docker compose up -d --build
```

This will build and start all services defined in `docker-compose.yaml`:

- Datastores: PostgreSQL, MongoDB
- Messaging: RabbitMQ (+ management UI)
- Backend services: Auction, Bidding, Search, Notification, Identity, API Gateway
- Frontend: Next.js web app
- Routing: nginx-proxy

Initial startup can take a few minutes while images build and health checks pass.

### Access URLs

- App: `http://app.mazad.se` (or `http://localhost:3000`)
- API Gateway: `http://api.mazad.se` (or `http://localhost:6001`)
- Identity: `http://id.mazad.se`
- Auction Service: `http://localhost:7001` (REST) and `http://localhost:7777` (gRPC)
- Search Service: `http://localhost:7002`
- Bidding Service: `http://localhost:7003`
- Notification Service: `http://localhost:7004`
- RabbitMQ Management: `http://localhost:15672` (default creds: guest/guest)

Notes:

- The proxy listens on port 80, so if hosts are configured you can use the `*.mazad.se` domains.
- The `devcerts` folder is mounted to the proxy; HTTPS is not required locally (proxy listens on 80).

### Service overview

The following services are built from source in `src/` and `frontend/` and orchestrated by Docker Compose:

- AuctionService (`src/AuctionService`)
- BiddingService (`src/BiddingService`)
- SearchService (`src/SearchService`)
- NotificationService (`src/NotificationService`)
- IdentityService (`src/IdentityService`)
- GatewayService (`src/GatewayService`)
- Web App (`frontend/web-app`)

Backing services:

- PostgreSQL (for Auction and Identity)
- MongoDB (for Search and Bidding)
- RabbitMQ (message broker)
- nginx-proxy (virtual host router)

### Useful Docker commands

```bash
# View running containers
docker ps

# Tail logs for everything (CTRL+C to stop)
docker compose logs -f

# Tail logs for a specific service
docker compose logs -f auction-svc

# Rebuild a single service
docker compose build web-app && docker compose up -d web-app

# Stop all
docker compose down

# Stop and remove volumes (resets databases)
docker compose down -v
```

### Troubleshooting

- Ports already in use
  - Ensure 80, 3000, 5432, 5672, 15672, 27017, 6001, 7001-7004, 7777 are free.
  - On Windows, close services using IIS or other web servers bound to port 80.

- Services not healthy / failing health checks
  - First run may take longer while databases initialize.
  - Retry: `docker compose up -d --build` and check `docker compose logs -f`.

- Hostnames not resolving
  - Confirm `/etc/hosts` (or Windows hosts) entries for `app.mazad.se`, `api.mazad.se`, `id.mazad.se`.
  - Alternatively use the localhost port URLs listed above.

- Resetting data
  - Remove volumes: `docker compose down -v` then `docker compose up -d --build`.

- RabbitMQ credentials
  - Default: guest/guest at `http://localhost:15672`.

### Development notes

- Environment variables are set in `docker-compose.yaml`.
- Web app uses `API_URL=http://gateway-svc/` inside the Docker network and exposes port 3000 for local access.
- Identity and client app domains are configured via `VIRTUAL_HOST` for `nginx-proxy` routing.

### Clean shutdown

```bash
docker compose down
```

To also clear all data volumes (Postgres/Mongo):

```bash
docker compose down -v
```


