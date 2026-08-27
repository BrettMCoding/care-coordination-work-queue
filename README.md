# Care Coordination Work Queue

Care Coordination Work Queue is an independent fictional care-team workflow prototype. The current implementation includes a static Expo web client and an initial Express API foundation for future backend work.

This project uses synthetic data only. It is not a clinical decision-making system and does not provide diagnoses, treatment recommendations, risk scoring, or medical advice.

## Live Demo

Planned deployment root: `https://carequeue.brettmarshmakesthings.com`

## Implemented

- TypeScript
- Expo frontend in `client/`
- React Native and React Native Web
- Expo Router
- Responsive synthetic care-team work queue screen
- Status and care-team-role filters
- Manually demonstrable loading, empty, and error states
- Static web export configuration
- Initial Express API foundation in `server/`
- `GET /health` health endpoint
- Request IDs, structured logging, JSON error responses, and graceful shutdown handling

## Current Architecture

- Client: Expo, React Native, React Native Web, TypeScript, and Expo Router in `client/`.
- Server: Node.js, Express, TypeScript, MongoDB Node.js driver, Zod validation, and Pino logging in `server/`.
- Database: MongoDB Atlas is the intended persistence layer.
- Client data loading: the normal path calls the backend API configured by `EXPO_PUBLIC_API_URL`.
- Mock mode: local client fixtures are used only when `EXPO_PUBLIC_USE_MOCK_DATA=true`.
- Static hosting ready: Expo web output is configured for static export to `client/dist`.
- No authentication, external AI API, or real patient data is included.

## Local Setup

Prerequisites:

- Node.js compatible with the current Expo SDK.
- npm.

Run locally:

```bash
cd client
npm install
copy .env.example .env.local
npm run web
```

Run the server locally:

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Seed synthetic data after configuring a MongoDB URI:

```bash
cd server
npm run seed:synthetic
```

## Web Build

Create a production static export:

```bash
cd client
npm run build:web
```

Preview the exported site locally:

```bash
cd client
npm run serve:web
```

The generated `client/dist` directory is ignored by Git and is intended to be uploaded to the static host for the dedicated subdomain root.

## Planned Features

- Outreach attempt workflow
- Record detail view
- Automated tests for filtering, validation, and API behavior
- Basic observability and health checks
- Google Cloud Run deployment

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)

## Project Status

The frontend and backend core stack are implemented. MongoDB Atlas and Google Cloud Run still require external account credentials and configuration before the deployed app can serve persistent data.
