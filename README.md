# Care Coordination Work Queue

Care Coordination Work Queue is an independent fictional full-stack portfolio prototype for organizing follow-up work across a multidisciplinary care team. It includes a deployed Expo web client, a deployed Node.js/Express API, and MongoDB Atlas persistence.

This project uses fictional data only. It is not a clinical decision-making system and does not provide diagnoses, treatment recommendations, risk scoring, or medical advice.

## Live Demo

- [Live web app](https://carequeue.brettmarshmakesthings.com)
- [Public API](https://carequeue-api-2gctn4p6ia-uc.a.run.app)
- [Public repository](https://github.com/brettmcoding/care-coordination-work-queue)

## Implemented

- Responsive Expo frontend in `client/`
- React Native and React Native Web
- TypeScript
- Expo Router
- Status and care-team-role filters
- Summary counts for visible, overdue, and urgent cases
- Loading, empty, error, and retry states
- Explicit `View details` action with an accessible case-detail modal
- API service layer configured by `EXPO_PUBLIC_API_URL`
- Explicit mock mode only when `EXPO_PUBLIC_USE_MOCK_DATA=true`
- Node.js, Express, and TypeScript backend in `server/`
- MongoDB Atlas persistence through the official MongoDB Node.js driver
- Rolling fictional dates so demo follow-up dates remain coherent over time
- `GET /health` and `GET /ready` endpoints
- Runtime validation with Zod
- Request IDs, structured Pino logging, and consistent JSON errors
- Automated client and server tests
- Dockerized backend suitable for Google Cloud Run
- Static Expo web export for cPanel hosting

## Current Architecture

- Client: Expo, React Native, React Native Web, TypeScript, and Expo Router in `client/`.
- Frontend hosting: static Expo web export served from Namecheap cPanel at `https://carequeue.brettmarshmakesthings.com`.
- Server: Node.js, Express, TypeScript, MongoDB Node.js driver, Zod validation, and Pino logging in `server/`.
- Backend hosting: Google Cloud Run service `carequeue-api` in `us-central1`.
- Database: MongoDB Atlas, using a `workQueueCases` collection containing fictional records.
- Secrets: the MongoDB URI is supplied to Cloud Run through Google Secret Manager.
- Client data loading: the normal path calls the deployed API configured by `EXPO_PUBLIC_API_URL`.
- Mock mode: local client fixtures are used only when `EXPO_PUBLIC_USE_MOCK_DATA=true`.
- No authentication, authorization, write workflow, external AI API, or real patient data is included.

## Local Setup

Prerequisites:

- Node.js compatible with the current Expo SDK and server toolchain.
- npm.
- Optional for backend persistence: MongoDB Atlas connection string in a local, ignored `server/.env`.

Run the client locally:

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

Seed fictional data after configuring a MongoDB URI:

```bash
cd server
npm run seed:fictional
```

## Validation

Client:

```bash
cd client
npm run lint
npm run typecheck
npm test
npm run build:web
```

Server:

```bash
cd server
npm run lint
npm run typecheck
npm test
npm run build
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

`EXPO_PUBLIC_API_URL` is embedded into the static bundle during export. Set it before building when targeting a different API environment. The generated `client/dist` directory is ignored by Git and should be uploaded to the static host for the dedicated subdomain root.

## Future Work And Known Limitations

- Authentication and authorization.
- Write workflows for status updates, assignment changes, and outreach attempts.
- Outreach-attempt history and richer activity timelines.
- Auditability for user actions.
- Rate limiting and abuse protection.
- Stronger production monitoring and alerting.
- CI/CD pipeline.
- Infrastructure as code.
- End-to-end browser tests in CI.
- Private MongoDB networking and tighter production network controls.
- External AI functionality, if added later, with clear human-review boundaries.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Deployment](docs/DEPLOYMENT.md)
