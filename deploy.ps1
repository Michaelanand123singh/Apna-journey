# GCP Deployment Script for Apna Journey (PowerShell)
# This script ensures TypeScript is available during the build process

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

Write-Host "🚀 Starting GCP deployment for Apna Journey..." -ForegroundColor Green

# Check if required environment variables are set
if ([string]::IsNullOrEmpty($ProjectId)) {
    Write-Host "❌ Error: ProjectId parameter is required" -ForegroundColor Red
    Write-Host "Usage: .\deploy.ps1 -ProjectId your-project-id" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Project ID: $ProjectId" -ForegroundColor Cyan

# Install all dependencies (including dev dependencies for build)
Write-Host "📥 Installing all dependencies..." -ForegroundColor Yellow
npm ci

# Build the application
Write-Host "🔨 Building the application..." -ForegroundColor Yellow
npm run build

# Build Docker image
Write-Host "🐳 Building Docker image..." -ForegroundColor Yellow
docker build -t "gcr.io/$ProjectId/apna-journey:latest" .

# Push to Google Container Registry
Write-Host "📤 Pushing to Google Container Registry..." -ForegroundColor Yellow
docker push "gcr.io/$ProjectId/apna-journey:latest"

# Deploy to Cloud Run
Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy apna-journey `
  --image "gcr.io/$ProjectId/apna-journey:latest" `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 3000 `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars NODE_ENV=production

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your app is now running on Cloud Run" -ForegroundColor Cyan
