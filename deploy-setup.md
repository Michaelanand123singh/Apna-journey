# GCP Cloud Run Deployment Setup Guide

This guide will help you deploy your Apna Journey Next.js application to Google Cloud Platform using Cloud Run with GitHub integration.

## Prerequisites

1. Google Cloud Platform account
2. GitHub repository
3. MongoDB Atlas database
4. Cloudinary account (for image storage)
5. Gmail account with App Password (for email functionality)

## Step 1: GCP Project Setup

1. Create a new GCP project or use an existing one
2. Enable the following APIs:
   - Cloud Run API
   - Cloud Build API
   - Artifact Registry API
   - Secret Manager API

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Create Artifact Registry Repository

```bash
# Create Artifact Registry repository
gcloud artifacts repositories create apna-journey-repo \
    --repository-format=docker \
    --location=asia-south1 \
    --description="Docker repository for Apna Journey app"
```

## Step 3: Set up Secrets in Secret Manager

Create secrets for all sensitive environment variables:

```bash
# Database
echo "your-mongodb-atlas-connection-string" | gcloud secrets create MONGODB_URI --data-file=-

# JWT Secrets
echo "your-super-secret-jwt-key-here-min-32-chars" | gcloud secrets create JWT_SECRET --data-file=-
echo "your-admin-jwt-secret-here-min-32-chars" | gcloud secrets create ADMIN_JWT_SECRET --data-file=-

# Cloudinary
echo "your-cloudinary-url" | gcloud secrets create CLOUDINARY_URL --data-file=-

# Email Configuration
echo "smtp.gmail.com" | gcloud secrets create EMAIL_HOST --data-file=-
echo "587" | gcloud secrets create EMAIL_PORT --data-file=-
echo "your-email@gmail.com" | gcloud secrets create EMAIL_USER --data-file=-
echo "your-app-password" | gcloud secrets create EMAIL_PASS --data-file=-

# App Configuration
echo "https://your-domain.com" | gcloud secrets create NEXTAUTH_URL --data-file=-
echo "your-nextauth-secret-min-32-chars" | gcloud secrets create NEXTAUTH_SECRET --data-file=-

# Redis (optional)
echo "your-redis-connection-string" | gcloud secrets create REDIS_URL --data-file=-
```

## Step 4: Create Service Account

```bash
# Create service account
gcloud iam service-accounts create apna-journey-sa \
    --display-name="Apna Journey Service Account" \
    --description="Service account for Apna Journey deployment"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:apna-journey-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:apna-journey-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:apna-journey-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:apna-journey-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Create and download service account key
gcloud iam service-accounts keys create apna-journey-sa-key.json \
    --iam-account=apna-journey-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 5: GitHub Secrets Setup

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Contents of the `apna-journey-sa-key.json` file
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong JWT secret (32+ characters)
- `ADMIN_JWT_SECRET`: A strong admin JWT secret (32+ characters)
- `CLOUDINARY_URL`: Your Cloudinary URL
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail App Password
- `NEXTAUTH_URL`: https://your-domain.com (update after deployment)
- `NEXTAUTH_SECRET`: A strong NextAuth secret (32+ characters)
- `REDIS_URL`: Your Redis connection string (optional)

## Step 6: Deploy

1. Push your code to the main/master branch
2. The GitHub Actions workflow will automatically:
   - Run tests and linting
   - Build the Docker image
   - Push to Artifact Registry
   - Deploy to Cloud Run

## Step 7: Configure Custom Domain (Optional)

1. In GCP Console, go to Cloud Run
2. Select your service
3. Click "Manage Custom Domains"
4. Add your domain and follow the verification steps

## Step 8: Update Environment Variables

After deployment, update the `NEXTAUTH_URL` secret with your actual domain:

```bash
echo "https://your-actual-domain.com" | gcloud secrets versions add NEXTAUTH_URL --data-file=-
```

## Monitoring and Logs

- View logs: `gcloud logs tail --service=apna-journey`
- Monitor metrics in GCP Console > Cloud Run > Metrics
- Set up alerts for errors and performance issues

## Troubleshooting

### Common Issues:

1. **Build fails**: Check GitHub Actions logs for specific errors
2. **Service won't start**: Check Cloud Run logs for startup errors
3. **Database connection issues**: Verify MongoDB Atlas network access and credentials
4. **Image upload fails**: Check Cloudinary configuration
5. **Email not working**: Verify Gmail App Password and SMTP settings

### Useful Commands:

```bash
# View service status
gcloud run services describe apna-journey --region=asia-south1

# View recent logs
gcloud logs read --service=apna-journey --limit=50

# Update service with new image
gcloud run deploy apna-journey --image=asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/apna-journey-repo/apna-journey:latest --region=asia-south1
```

## Security Best Practices

1. Use strong, unique secrets
2. Enable Cloud Armor for DDoS protection
3. Set up monitoring and alerting
4. Regularly rotate secrets
5. Use least privilege principle for service accounts
6. Enable audit logging
7. Use HTTPS only (enabled by default in Cloud Run)

## Cost Optimization

1. Set appropriate min/max instances
2. Use CPU allocation only during request processing
3. Monitor usage and adjust resources accordingly
4. Use Cloud CDN for static assets if needed
5. Consider using Cloud SQL for database if MongoDB costs are high
