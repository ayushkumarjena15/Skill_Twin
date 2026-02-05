# Script to copy Anshuman Nayak's photo to the team folder
# Usage: Run this script and provide the path to the photo when prompted

$destinationPath = "c:\Users\ankit\OneDrive\Desktop\ayush\public\team\anshuman-nayak.jpg"

Write-Host "=== Copy Anshuman Nayak Photo ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Destination: $destinationPath" -ForegroundColor Yellow
Write-Host ""

# Check recent downloads
$downloads = Get-ChildItem -Path "$env:USERPROFILE\Downloads" -Filter "*.jpg" -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 10

if ($downloads) {
    Write-Host "Recent JPG files in Downloads:" -ForegroundColor Green
    for ($i = 0; $i -lt $downloads.Count; $i++) {
        Write-Host "[$i] $($downloads[$i].Name) - $($downloads[$i].LastWriteTime)" -ForegroundColor White
    }
    Write-Host ""
    $choice = Read-Host "Enter the number of the correct photo [0-9], or press Enter to specify a custom path"
    
    if ($choice -match '^\d+$' -and [int]$choice -lt $downloads.Count) {
        $sourcePath = $downloads[[int]$choice].FullName
        Copy-Item -Path $sourcePath -Destination $destinationPath -Force
        Write-Host "Image updated successfully!" -ForegroundColor Green
        exit 0
    }
}

# Manual path input
$sourcePath = Read-Host "Enter the full path to the new photo (e.g., C:\Users\Name\Desktop\photo.jpg)"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $destinationPath -Force
    Write-Host "Image copied successfully to: $destinationPath" -ForegroundColor Green
} else {
    Write-Host "Error: File not found at $sourcePath" -ForegroundColor Red
    exit 1
}
