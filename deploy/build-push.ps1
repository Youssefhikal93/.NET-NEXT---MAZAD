# Builds and pushes multi-arch (amd64 + arm64) images for all services.
# Run from the repo root:  .\deploy\build-push.ps1 -Domain yourname.duckdns.org
# Requires: Docker Desktop with buildx, and `docker login` done beforehand.

param(
    [Parameter(Mandatory = $true)]
    [string]$Domain,
    [string]$DockerHubUser = "youssefhikal"
)

$ErrorActionPreference = "Stop"
$platforms = "linux/amd64,linux/arm64"

# One-time builder setup (safe to re-run).
docker buildx create --name mazad-builder --use 2>$null
docker buildx inspect --bootstrap | Out-Null

$services = @(
    @{ name = "auction-svc";  dockerfile = "src/AuctionService/Dockerfile" },
    @{ name = "search-svc";   dockerfile = "src/SearchService/Dockerfile" },
    @{ name = "identity-svc"; dockerfile = "src/IdentityService/Dockerfile" },
    @{ name = "gateway-svc";  dockerfile = "src/GatewayService/Dockerfile" },
    @{ name = "bid-svc";      dockerfile = "src/BiddingService/Dockerfile" },
    @{ name = "notify-svc";   dockerfile = "src/NotificationService/Dockerfile" }
)

foreach ($svc in $services) {
    Write-Host "==> Building $($svc.name)" -ForegroundColor Cyan
    docker buildx build `
        --platform $platforms `
        -t "$DockerHubUser/$($svc.name):latest" `
        -f $svc.dockerfile `
        --push .
    if ($LASTEXITCODE -ne 0) { throw "Build failed for $($svc.name)" }
}

Write-Host "==> Building web-app" -ForegroundColor Cyan
docker buildx build `
    --platform $platforms `
    -t "$DockerHubUser/web-app:latest" `
    --build-arg "NEXT_PUBLIC_NOTIFY_URL=https://api.$Domain/notifications" `
    --push ./frontend/web-app
if ($LASTEXITCODE -ne 0) { throw "Build failed for web-app" }

Write-Host "All images pushed." -ForegroundColor Green
