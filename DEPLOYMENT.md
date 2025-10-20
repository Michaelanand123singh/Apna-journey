# GCP Deployment Guide for Apna Journey

This guide explains how to deploy the Apna Journey application to Google Cloud Platform (GCP) while resolving the TypeScript dependency issue.

## 🚨 Problem Solved

The original issue was that TypeScript was installed as a dev dependency, but GCP's `npm ci --only=production` command excludes dev dependencies, causing the build to fail when Next.js tries to process `next.config.ts`.

## ✅ Solution Implemented

1. **Moved TypeScript to production dependencies** in `package.json`
2. **Moved all TypeScript type definitions** to production dependencies
3. **Created optimized Docker configuration** for GCP deployment
4. **Added proper `.gcloudignore`** to exclude unnecessary files
5. **Created deployment scripts** for easy deployment

## 📋 Prerequisites

- Google Cloud SDK installed and configured
- Docker installed
- Node.js 18+ installed
- GCP project with billing enabled
- Container Registry API enabled

## 🚀 Deployment Methods

### Method 1: Using PowerShell Script (Windows)

```powershell
# Set your project ID
$env:PROJECT_ID = "your-project-id"

# Run the deployment script
.\deploy.ps1 -ProjectId $env:PROJECT_ID
```

### Method 2: Using Bash Script (Linux/Mac)

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Make script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Method 3: Manual Deployment

```bash
# 1. Install all dependencies (including dev dependencies)
npm ci

# 2. Build the application
npm run build

# 3. Build Docker image
docker build -t gcr.io/$PROJECT_ID/apna-journey:latest .

# 4. Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/apna-journey:latest

# 5. Deploy to Cloud Run
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
```

### Method 4: Using Cloud Build

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## 🔧 Configuration Files

### package.json Changes
- Moved `typescript` to `dependencies`
- Moved `@types/*` packages to `dependencies`
- Kept only build tools in `devDependencies`

### Dockerfile
- Multi-stage build for optimization
- Uses Node.js 18 Alpine for smaller image size
- Implements security best practices
- Enables standalone output for better performance

### .gcloudignore
- Excludes unnecessary files from deployment
- Reduces upload time and storage costs
- Includes common Node.js exclusions

### cloudbuild.yaml
- Automated build and deployment pipeline
- Configures Cloud Run with optimal settings
- Sets production environment variables

## 🌐 Environment Variables

Make sure to set these environment variables in your GCP project:

```bash
# Required
MONGODB_URI=mongodb://your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key

# Cloudinary (optional)
CLOUDINARY_URL=your-cloudinary-url
# OR individual variables:
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (optional)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 📊 Performance Optimizations

### Docker Image
- **Size**: ~200MB (optimized with Alpine Linux)
- **Layers**: Multi-stage build reduces final image size
- **Security**: Non-root user execution
- **Caching**: Optimized layer caching

### Cloud Run Configuration
- **Memory**: 1GB (adjustable based on usage)
- **CPU**: 1 vCPU (adjustable based on usage)
- **Instances**: 0-10 (auto-scaling)
- **Port**: 3000 (Next.js default)

### Next.js Optimizations
- **Standalone output**: Reduces bundle size
- **Compression**: Enabled for better performance
- **Security headers**: Implemented for security
- **Image optimization**: Cloudinary integration

## 🔍 Troubleshooting

### Common Issues

1. **TypeScript not found during build**
   - Solution: Ensure TypeScript is in `dependencies`, not `devDependencies`

2. **Build fails with memory issues**
   - Solution: Increase Cloud Run memory allocation

3. **Docker build fails**
   - Solution: Check Dockerfile syntax and ensure all files are present

4. **Environment variables not working**
   - Solution: Set variables in Cloud Run service configuration

### Debug Commands

```bash
# Check build logs
gcloud builds log [BUILD_ID]

# Check Cloud Run logs
gcloud run services logs apna-journey --region us-central1

# Test locally
docker run -p 3000:3000 gcr.io/$PROJECT_ID/apna-journey:latest
```

## 📈 Monitoring

### Cloud Run Metrics
- Request count and latency
- Memory and CPU usage
- Error rates and status codes

### Application Logs
- Access logs via Cloud Console
- Set up log-based metrics
- Configure alerting for errors

## 🔄 CI/CD Pipeline

For automated deployments, you can:

1. **Connect to GitHub** and use Cloud Build triggers
2. **Set up webhooks** for automatic deployments
3. **Use Cloud Build** with the provided `cloudbuild.yaml`

## 💰 Cost Optimization

- **Min instances**: Set to 0 to avoid idle costs
- **Max instances**: Limit based on expected traffic
- **Memory/CPU**: Right-size based on actual usage
- **Region**: Choose closest to your users

## 🛡️ Security

- **HTTPS**: Automatically enabled by Cloud Run
- **Security headers**: Implemented in Next.js config
- **Non-root user**: Docker container runs as non-root
- **Environment variables**: Securely managed by GCP

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Cloud Run logs in GCP Console
3. Verify environment variables are set correctly
4. Ensure all dependencies are properly installed

---

**Happy Deploying! 🚀**
