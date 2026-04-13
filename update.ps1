$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Updating RigStack..." -ForegroundColor Cyan

try {
    git pull origin main
} catch {
    Write-Host "git pull failed: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Cyan
try {
    npm install --silent
} catch {
    Write-Host "npm install failed: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building..." -ForegroundColor Cyan
try {
    npm run tauri build
} catch {
    Write-Host "Build failed: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Done. Find the installer in src-tauri\target\release\bundle\" -ForegroundColor Green
Read-Host "Press Enter to exit"
