# Tiara Sports - Deployment Script
# This script automates the build and deployment process

param(
    [string]$message = "Update deployment",
    [switch]$skipBuild,
    [switch]$skipTests
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TIARA SPORTS DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($command)
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "git")) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites OK" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "📝 Uncommitted changes detected:" -ForegroundColor Cyan
    git status --short
    Write-Host ""
} else {
    Write-Host "✅ Working directory clean" -ForegroundColor Green
    Write-Host ""
}

# Run type checking (linting)
if (-not $skipTests) {
    Write-Host "Running type checks..." -ForegroundColor Yellow
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Type checking failed!" -ForegroundColor Red
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -ne "y") {
            exit 1
        }
    } else {
        Write-Host "✅ Type checks passed" -ForegroundColor Green
    }
    Write-Host ""
}

# Build the project
if (-not $skipBuild) {
    Write-Host "Building project..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Build successful" -ForegroundColor Green
    Write-Host ""

    # Check build output
    if (Test-Path "dist") {
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "📦 Build size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Cyan
    }
    Write-Host ""
}

# Git operations
Write-Host "Preparing to commit and push..." -ForegroundColor Yellow

# Add all changes
git add .

# Check if there are changes to commit
$changes = git diff --staged --name-only
if (-not $changes) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Files to commit:" -ForegroundColor Cyan
    $changes | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
    Write-Host ""

    # Commit changes
    git commit -m $message
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Changes committed" -ForegroundColor Green
    Write-Host ""
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed to GitHub successfully" -ForegroundColor Green
Write-Host ""

# Display next steps
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your SmarterASP.NET control panel" -ForegroundColor White
Write-Host "2. Navigate to Git Deployment section" -ForegroundColor White
Write-Host "3. Click 'Pull Latest Changes' or 'Deploy'" -ForegroundColor White
Write-Host "4. Wait for deployment to complete" -ForegroundColor White
Write-Host "5. Test your website" -ForegroundColor White
Write-Host ""
Write-Host "Repository: https://github.com/MikirParekh/tiara-sports" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
