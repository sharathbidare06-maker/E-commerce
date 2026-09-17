param(
    [Parameter(Mandatory = $true)]
    [string]$Service
)

$services = docker compose config --services
if ($LASTEXITCODE -ne 0 -or $services -notcontains $Service) {
    Write-Error "Unknown Compose service: $Service"
    exit 1
}

docker compose build $Service
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

docker compose up -d $Service
exit $LASTEXITCODE
