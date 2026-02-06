# Script to update team member photos
# Use this to copy your downloaded photos to the correct location

$teamDir = "c:\Users\ankit\OneDrive\Desktop\SkillTwin\public\team"
if (!(Test-Path $teamDir)) {
    New-Item -ItemType Directory -Force -Path $teamDir | Out-Null
}

Write-Host "=== SkillTwin Team Photo Updater ===" -ForegroundColor Cyan
Write-Host "This script will help you copy the photos you uploaded." -ForegroundColor Gray
Write-Host ""

# Update Anshuman's Photo
Write-Host "1. Anshuman Nayak's Photo" -ForegroundColor Yellow
$anshumanPath = Read-Host "Enter full path to the downloaded photo for Anshuman Nayak"
if ($anshumanPath -ne "" -and (Test-Path $anshumanPath)) {
    Copy-Item -Path $anshumanPath -Destination "$teamDir\anshuman-nayak.jpg" -Force
    Write-Host "Updated Anshuman's photo!" -ForegroundColor Green
} else {
    Write-Host "Skipped Anshuman's photo (invalid path)" -ForegroundColor Red
}

Write-Host ""

# Update Ankit's Photo
Write-Host "2. Ankit Naik's Photo" -ForegroundColor Yellow
$ankitPath = Read-Host "Enter full path to the downloaded photo for Ankit Naik"
if ($ankitPath -ne "" -and (Test-Path $ankitPath)) {
    Copy-Item -Path $ankitPath -Destination "$teamDir\ankit-naik.jpg" -Force
    Write-Host "Updated Ankit's photo!" -ForegroundColor Green
} else {
    Write-Host "Skipped Ankit's photo (invalid path)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done! Refresh the page to see changes." -ForegroundColor Cyan
