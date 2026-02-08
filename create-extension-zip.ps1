# Script för att skapa distributions-zip av Jira TimeKeep Extension
# Kör detta från projektroten

Write-Host "`n🎁 Skapar distributions-zip..." -ForegroundColor Cyan

# Kontrollera att vi är i rätt mapp
if (-not (Test-Path "jira-timekeeper-extension")) {
    Write-Host "❌ Fel: Kan inte hitta jira-timekeeper-extension mappen" -ForegroundColor Red
    Write-Host "   Kör detta script från projektroten (time-keep)" -ForegroundColor Yellow
    exit 1
}

# Skapa temp-mapp
$tempDir = "temp-extension-dist"
Write-Host "📁 Kopierar filer..." -ForegroundColor White

if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

Copy-Item -Path "jira-timekeeper-extension" -Destination $tempDir -Recurse

# Ta bort filer som inte behövs för distribution
Write-Host "🧹 Rensar utvecklarfiler..." -ForegroundColor White

$filesToRemove = @(
    "$tempDir\.git",
    "$tempDir\QUICKSTART.md",
    "$tempDir\HOW_TO_CREATE_ICONS.md",
    "$tempDir\ICONS_NEEDED.html",
    "$tempDir\icon128.svg",
    "$tempDir\DISTRIBUTION.md"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Recurse -Force
        Write-Host "  ✓ Tog bort: $(Split-Path $file -Leaf)" -ForegroundColor Gray
    }
}

# Skapa zip
$zipName = "jira-timekeeper-extension.zip"
Write-Host "📦 Skapar $zipName..." -ForegroundColor White

if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName -Force

# Rensa temp
Remove-Item $tempDir -Recurse -Force

# Klar!
Write-Host "`n✅ Klar!" -ForegroundColor Green
Write-Host "📦 Zip-fil skapad: $zipName" -ForegroundColor Cyan
Write-Host "`n📋 Nästa steg:" -ForegroundColor Yellow
Write-Host "  1. Dela $zipName med dina kollegor" -ForegroundColor White
Write-Host "  2. Dela jira-timekeeper-extension\INSTALLATION.md" -ForegroundColor White
Write-Host "`nSe jira-timekeeper-extension\DISTRIBUTION.md för mer info!" -ForegroundColor Gray
