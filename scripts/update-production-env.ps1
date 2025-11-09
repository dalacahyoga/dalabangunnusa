# PowerShell script to update .env.production with Railway backend URL
# Usage: .\scripts\update-production-env.ps1 [railway-url]

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayUrl
)

# Remove trailing slash if present
$RailwayUrl = $RailwayUrl.TrimEnd('/')

# Ensure URL ends with /api
if (-not $RailwayUrl.EndsWith('/api')) {
    $RailwayUrl = "$RailwayUrl/api"
}

# Create .env.production file
@"
# Production Environment Variables
# Generated automatically - DO NOT EDIT manually unless you know what you're doing

VITE_API_URL=$RailwayUrl
VITE_USE_API=true
"@ | Out-File -FilePath .env.production -Encoding utf8

Write-Host "✅ .env.production updated successfully!" -ForegroundColor Green
Write-Host "   VITE_API_URL=$RailwayUrl" -ForegroundColor Cyan
Write-Host "   VITE_USE_API=true" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Run 'npm run build' to rebuild with the new API URL" -ForegroundColor Yellow

