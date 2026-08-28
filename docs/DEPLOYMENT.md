# Deployment

This document describes the current deployed architecture and the repeatable redeployment workflow. Do not commit secrets, generated deployment archives, service account keys, MongoDB connection strings, or production credentials.

## Current Deployed Architecture

- Frontend: static Expo web export hosted at `https://carequeue.brettmarshmakesthings.com`.
- Frontend hosting: Namecheap cPanel static hosting.
- Backend: Google Cloud Run service `carequeue-api`.
- Public API: `https://carequeue-api-2gctn4p6ia-uc.a.run.app`.
- Google Cloud project: `carequeue-brett-2026`.
- Region: `us-central1`.
- Database: MongoDB Atlas.
- Secrets: `MONGODB_URI` is supplied through Google Secret Manager.

The deployed client normally calls the public API. Local mock data is used only when `EXPO_PUBLIC_USE_MOCK_DATA=true`.

## Backend Redeployment

Use the existing Cloud Run service and preserve its current environment variables and Secret Manager binding unless you intentionally need to change them.

Recommended preflight:

```bash
gcloud run services describe carequeue-api \
  --region us-central1 \
  --project carequeue-brett-2026 \
  --format="value(status.url)"
```

Redeploy from source:

```bash
gcloud run deploy carequeue-api \
  --source server \
  --region us-central1 \
  --project carequeue-brett-2026 \
  --allow-unauthenticated
```

After deployment, verify:

```bash
curl https://carequeue-api-2gctn4p6ia-uc.a.run.app/health
curl https://carequeue-api-2gctn4p6ia-uc.a.run.app/ready
curl "https://carequeue-api-2gctn4p6ia-uc.a.run.app/api/cases?status=overdue"
```

`/health` confirms the Node process responds. `/ready` verifies MongoDB connectivity.

## Frontend Rebuild And cPanel Redeployment

`EXPO_PUBLIC_API_URL` is embedded during static Expo export. Confirm `client/.env.local` points at the deployed API before building:

```env
EXPO_PUBLIC_API_URL=https://carequeue-api-2gctn4p6ia-uc.a.run.app
EXPO_PUBLIC_USE_MOCK_DATA=false
```

Build the static web client:

```bash
cd client
npm install
npm run lint
npm run typecheck
npm test
npm run build:web
```

Preview the exported files locally:

```bash
npm run serve:web
```

Package the exported site for Linux/cPanel-compatible upload:

```bash
tar -czf carequeue-web-update.tar.gz -C dist .
```

Upload the contents of `dist`, or extract the archive contents, into the cPanel document root for `carequeue.brettmarshmakesthings.com`. The files inside `dist` should be at the subdomain root, not nested inside an extra `dist` directory.

## Command Differences

- `npm run web`: starts the Expo development server for local interactive development.
- `expo export --platform web`: creates a production static web build.
- `npm run build:web`: project script for `expo export --platform web`.
- `npm run serve:web`: serves the already-exported `dist` directory for local preview.
- `tar -czf carequeue-web-update.tar.gz -C dist .`: packages the exported files for upload.

## Initial Provisioning Reference

The current deployment is already provisioned. These commands are retained as a reference for recreating or repairing the environment.

Set shell variables:

```bash
export PROJECT_ID="carequeue-brett-2026"
export REGION="us-central1"
export SERVICE="carequeue-api"
export REPOSITORY="carequeue"
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

Create an Artifact Registry repository if using explicit image builds:

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

Build and push the backend Docker image explicitly:

```bash
gcloud builds submit server \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"
```

Deploy an explicit image:

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

Seed fictional data after configuring a local ignored `server/.env` with the intended MongoDB URI:

```bash
cd server
npm run seed:fictional
```

## Future Production Hardening

- Use a dedicated runtime service account with least-privilege IAM.
- Tighten MongoDB Atlas network access and consider private connectivity.
- Add CI/CD for validation, image builds, and deployments.
- Add infrastructure as code for Cloud Run, Artifact Registry, secrets, and DNS-adjacent configuration.
- Add managed alerts for elevated error rates, readiness failures, and latency.
- Add authentication, authorization, audit history, and rate limiting before any real workflow use.
- Continue excluding `dist`, `.env` files, ZIP/TAR archives, logs, credentials, and generated deployment packages from Git.
