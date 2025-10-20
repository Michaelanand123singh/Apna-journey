#!/bin/bash

# GCP Deployment Script for Apna Journey
# This script ensures TypeScript is available during the build process

set -e

echo "🚀 Starting GCP deployment for Apna Journey..."

# Check if required environment variables are set
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID environment variable is not set"
    echo "Please set it with: export PROJECT_ID=your-project-id"
    exit 1
fi

echo "📦 Project ID: $PROJECT_ID"

# Install all dependencies (including dev dependencies for build)
echo "📥 Installing all dependencies..."
npm ci

# Build the application
echo "🔨 Building the application..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/apna-journey:latest .

# Push to Google Container Registry
echo "📤 Pushing to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/apna-journey:latest

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy apna-journey \
  --image gcr.io/$PROJECT_ID/apna-journey:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

echo "✅ Deployment completed successfully!"
echo "🌐 Your app is now running on Cloud Run"
