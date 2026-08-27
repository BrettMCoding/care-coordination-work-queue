# Deployment

This document contains command templates for deploying the backend to Google Cloud Run and the static web client to the root of `https://carequeue.brettmarshmakesthings.com`.

Do not commit secrets, generated deployment archives, service account keys, MongoDB connection strings, or production credentials.

## Backend: Google Cloud Run

Prerequisites:

- Google Cloud project with billing enabled.
- `gcloud` CLI authenticated.
- MongoDB Atlas cluster and database user.
- Secret Manager access.
- Artifact Registry access.

Set local shell variables:

```bash
export PROJECT_ID="YOUR_PROJECT_ID"
export REGION="us-central1"
export REPOSITORY="carequeue"
export SERVICE="carequeue-api"
export IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}:latest"
```

Enable required APIs:

```bash
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  --project "${PROJECT_ID}"
```

Create an Artifact Registry repository:

```bash
gcloud artifacts repositories create "${REPOSITORY}" \
  --repository-format docker \
  --location "${REGION}" \
  --project "${PROJECT_ID}"
```

Create a Secret Manager secret for the MongoDB URI:

```bash
gcloud secrets create carequeue-mongodb-uri \
  --replication-policy automatic \
  --project "${PROJECT_ID}"
```

Add the MongoDB URI as a secret version. Do not paste real credentials into a committed file:

```bash
printf '%s' 'YOUR_MONGODB_ATLAS_URI' | \
  gcloud secrets versions add carequeue-mongodb-uri \
    --data-file=- \
    --project "${PROJECT_ID}"
```

Grant the runtime service account access to the secret. Replace the service account if you use a dedicated one:

```bash
export PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
export RUNTIME_SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding carequeue-mongodb-uri \
  --member "serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
  --role roles/secretmanager.secretAccessor \
  --project "${PROJECT_ID}"
```

Build and push the backend image using Cloud Build:

```bash
gcloud builds submit server \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"
```

Deploy to Cloud Run:

```bash
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,HOST=0.0.0.0,MONGODB_DB_NAME=carequeue,CORS_ALLOWED_ORIGINS=https://carequeue.brettmarshmakesthings.com" \
  --set-secrets "MONGODB_URI=carequeue-mongodb-uri:latest" \
  --project "${PROJECT_ID}"
```

Seed synthetic data after deployment by running the seed command locally against the Atlas URI, or by creating a one-off Cloud Run job later. This repository does not include a Cloud Run job definition yet.

## Client: Static Expo Web

Set the production API URL in `client/.env.local` before exporting:

```bash
EXPO_PUBLIC_API_URL=https://YOUR_CLOUD_RUN_SERVICE_URL
EXPO_PUBLIC_USE_MOCK_DATA=false
```

Export the static site:

```bash
cd client
npm install
npm run build:web
```

Upload the contents of `client/dist` to the hosting provider for the subdomain root. No Expo `baseUrl` is configured because the site is intended to live at the root of a dedicated subdomain.

## Remaining Manual Steps

- Create or configure the MongoDB Atlas cluster.
- Create the MongoDB database user and network access rules.
- Create Google Cloud project resources and permissions.
- Deploy the Cloud Run service.
- Configure the Namecheap subdomain DNS.
- Configure cPanel or static hosting to serve the exported `client/dist` files.
- Run the synthetic seed command against the intended database.
