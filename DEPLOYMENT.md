# Deploying MAZAD to Oracle Cloud Always Free (single VM, $0/month)

The whole stack (6 services + Postgres + MongoDB + RabbitMQ + Next.js + Caddy)
runs on one Oracle Cloud **Always Free** ARM VM behind Caddy, which handles
HTTPS automatically.

```
                        ┌─────────────────────── Oracle VM ───────────────────────┐
 Browser ── HTTPS ──►   │ Caddy ──► app.<domain> ─► web-app   (Next.js :3000)     │
                        │       ──► api.<domain> ─► gateway   (YARP :80)          │
                        │       ──► id.<domain>  ─► identity  (Duende :80)        │
                        │ gateway ─► auction / search / bid / notify              │
                        │ services ─► postgres · mongodb · rabbitmq (internal)    │
                        └──────────────────────────────────────────────────────────┘
```

## What was changed to make this deployable

- All hardcoded `localhost` URLs are now environment-driven
  (`auth.ts`, `fetchWrapper.ts`, `SignalRProvider.tsx`, `Config.cs`, `HostingExtensions.cs`).
- IdentityService trusts `X-Forwarded-*` headers (it runs behind Caddy) and
  reads `IssuerUri`, `ClientApp`, and `ClientSecret` from config.
- New: `frontend/web-app/Dockerfile` (standalone Next.js build),
  `docker-compose.prod.yaml`, `deploy/Caddyfile`, `deploy/build-push.ps1`,
  `.env.prod.example`.
- Dockerfile base-image digest pins removed so `linux/arm64` builds work.

Local development is unchanged: `docker-compose.yaml` still works as before.

---

## Step 1 — Oracle Cloud account and VM (you do this once)

1. Sign up at <https://signup.cloud.oracle.com> (credit card needed for identity
   verification only — Always Free resources never charge). Pick a **home region**
   with ARM capacity; smaller regions (e.g. Stockholm, Marseille) are usually
   easier than Frankfurt/London.
2. Create the VM: **Compute → Instances → Create instance**
   - Image: **Ubuntu 24.04** (aarch64)
   - Shape: **Ampere → VM.Standard.A1.Flex**, set **4 OCPUs / 24 GB RAM**
     (that is the full Always Free allowance — use all of it)
   - Add your SSH public key, create, and note the **public IP**.
   - If you get "Out of capacity", try again later or script retries — capacity
     frees up daily.
3. Open ports 80/443. Two layers must both allow them:
   - **Cloud console**: VCN → your subnet → Security List → Add Ingress Rules:
     source `0.0.0.0/0`, TCP, destination ports `80` and `443` (add UDP 443 too
     for HTTP/3, optional).
   - **On the VM** (Oracle's Ubuntu images ship restrictive iptables rules):

     ```bash
     sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
     sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
     sudo netfilter-persistent save
     ```

## Step 2 — Free domain (DuckDNS)

1. Sign in at <https://www.duckdns.org> and create a subdomain, e.g. `mazad`.
2. Set its IP to the VM's public IP.
3. DuckDNS resolves sub-subdomains automatically, so `app.mazad.duckdns.org`,
   `api.mazad.duckdns.org`, and `id.mazad.duckdns.org` all point at the VM.
   No further DNS setup needed.

## Step 3 — Build and push multi-arch images (from your Windows machine)

The VM is ARM64, so images must be built for `linux/arm64` (the script also
builds `amd64` so local compose keeps working).

```powershell
docker login
.\deploy\build-push.ps1 -Domain mazad.duckdns.org
```

This pushes all 7 images (6 services + web-app) to Docker Hub. The frontend
image bakes `https://api.<domain>/notifications` into the client bundle, so
**rebuild web-app if the domain ever changes**.

## Step 4 — Configure and start on the VM

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker

# Get the code (only compose + Caddyfile are needed, but cloning is simplest)
git clone https://github.com/Youssefhikal93/.NET-NEXT---MAZAD.git mazad
cd mazad

# Configure secrets
cp .env.prod.example .env.prod
nano .env.prod    # set DOMAIN, passwords, CLIENT_SECRET, AUTH_SECRET
                  # generate secrets with: openssl rand -base64 32

# Start everything
docker compose -f docker-compose.prod.yaml --env-file .env.prod pull
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

Caddy obtains Let's Encrypt certificates automatically on first request
(can take ~30 s after startup).

## Step 5 — Verify

- `https://app.<domain>` — frontend loads, auctions listed
- `https://api.<domain>/search` — returns JSON
- `https://id.<domain>/.well-known/openid-configuration` — issuer must be `https://id.<domain>`
- Log in, place a bid in one browser, watch it appear live (SignalR) in another
- `docker compose -f docker-compose.prod.yaml logs -f <service>` for debugging

## Updating after code changes

```powershell
# local machine
.\deploy\build-push.ps1 -Domain mazad.duckdns.org
```

```bash
# VM
docker compose -f docker-compose.prod.yaml --env-file .env.prod pull
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d
docker image prune -f
```

## Notes & gotchas

- **Why network aliases on caddy?** Cloud VMs can't reach their own public IP
  from inside (no hairpin NAT). The aliases make `id.<domain>` etc. resolve to
  the Caddy container from inside the Docker network, so the Next.js server can
  fetch the OIDC discovery document over HTTPS with a valid certificate.
- **Postgres/Mongo/RabbitMQ are not exposed publicly** in the prod compose —
  only Caddy listens on the host. The RabbitMQ management UI is internal-only;
  tunnel with `ssh -L 15672:localhost:15672 ubuntu@<vm-ip>` if you need it
  (requires temporarily publishing the port in an override file).
- Duende IdentityServer Community Edition is free for development, testing, and
  personal/demo projects.
- If Let's Encrypt rate-limits during testing, add `{ acme_ca https://acme-staging-v02.api.letsencrypt.org/directory }`
  to the top of the Caddyfile temporarily.
