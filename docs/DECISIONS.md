# Architecture Decision Log

This log records settled decisions and unresolved architecture questions. Keep entries concise and update them as the project moves through small milestones.

## Decisions

### 2026-08-26: Frontend scaffold

- Created the frontend in `client/` with Expo SDK 57 using the official `create-expo-app` default TypeScript template.
- Kept the repository as a simple root project with a standalone frontend directory. Backend and shared packages are deferred until their scope is clearer.
- Used Expo Router because it is included in the default Expo template and supports React Native plus web routing from the same route tree.
- Replaced the starter tab example with a single active work queue route for Day 1. Additional routes will be added only when record details or other workflows are implemented.
- Added `npm run typecheck` in the client so strict TypeScript can be validated separately from linting.
- Kept all Day 1 data local, typed, fictional, and frontend-only. No backend, database, authentication, or external AI API was added.

### 2026-08-26: Static web deployment preparation

- Kept Expo web output as `static`, matching the intended static deployment model.
- Did not configure an Expo `baseUrl` because the app is intended to be hosted at the root of a dedicated subdomain.
- Added `build:web` for `expo export --platform web` and `serve:web` for previewing the generated `dist` output.
- Replaced generated Expo template icons and removed unused starter assets so public repository assets are project-specific.
- Kept deployment artifacts such as `dist`, `.expo`, environment files, and ZIP archives ignored.

### 2026-08-26: Initial backend foundation

- Created the backend as a separate TypeScript Node package in `server/`, matching the `/client` and `/server` final architecture.
- Selected Express for the initial API foundation because it is familiar, small enough for this project, and easy to test with Supertest.
- Kept the Express app in `src/app.ts` separate from the process entry point in `src/index.ts` so request behavior can be tested without opening a network port.
- Configured the process entry point to respect `PORT` and listen on `0.0.0.0`, which matches Cloud Run expectations.
- Added request ID middleware that preserves incoming `x-request-id` values or generates one per request.
- Added Pino and pino-http for structured JSON logging with authorization and cookie header redaction.
- Added a consistent JSON error response shape for unknown routes and unexpected errors.
- Added graceful shutdown handling for `SIGTERM` and `SIGINT`.
- Added Vitest and Supertest coverage for health checks, request IDs, and not-found errors.
- Deferred MongoDB, Docker, Cloud Run deployment files, authentication, and AI integration.

### 2026-08-26: MongoDB-backed API and client integration

- Used the official MongoDB Node.js driver for persistence and kept the connection as a reusable process-level client.
- Added `GET /ready` for MongoDB connectivity while keeping `GET /health` independent of the database.
- Modeled the backend API around the existing client queue fields: client alias, team roles, last contact, next follow-up, status, and urgency.
- Added `GET /api/cases` with status, role, urgency, search, and sort query parameters. The current client uses status and role filters.
- Added `GET /api/cases/:id` for typed case detail retrieval even though the current UI has not added a detail route yet.
- Used Zod for environment, query, route-parameter, and future request-body validation.
- Added a safe repeatable fictional seed command that upserts known fictional cases by stable IDs.
- Added MongoDB indexes for status/date, assigned role/date, urgency/date, and text search.
- Added CORS allowlist configuration for localhost development origins and the production web origin.
- Added a production Dockerfile for the server using a Node 24 image and a non-root runtime user.
- Kept client mock data behind explicit `EXPO_PUBLIC_USE_MOCK_DATA=true`; the normal client path calls the configured API and does not silently fall back.

### 2026-08-27: Client case detail interaction

- Kept queue cards non-interactive so vertical mobile scrolling is not competing with a full-card press target.
- Added an explicit `View details` action on each card and used the existing `GET /api/cases/:id` backend contract for modal detail loading.
- Kept the detail view as a shared React Native `Modal` instead of a web-only route so browser, Android, and iOS behavior stays aligned.
- Added a small reducer for case detail selection, retry, and close state so the interaction can be tested without adding a heavier UI testing dependency.

### 2026-08-27: Mobile web scrolling ownership

- Kept the outer work queue `ScrollView` as the single owner of page-level vertical scrolling.
- Replaced the nested disabled `FlatList` with a normal mapped `View` because the prototype renders a small number of fictional cases and does not need list virtualization.
- Made the header layout mobile-first and moved fixed row/flex-basis sizing behind the wide-screen breakpoint to prevent narrow viewport overflow.
- Unmounted the case detail modal when closed so its backdrop cannot keep intercepting touches after dismissal.

### 2026-08-28: Rolling demo follow-up dates

- Changed the demo case dates from fixed calendar values to stable offsets from the current date.
- Preserved the existing status and urgency mix so the queue still demonstrates overdue, due-soon, scheduled, waiting, urgent, elevated, and routine states over time.
- Applied rolling dates in both client mock mode and server response mapping so the deployed API does not require daily reseeding just to keep dates coherent.

### 2026-08-28: Deployed hybrid hosting

- Deployed the static Expo web client separately from the API so the frontend can be served from the dedicated Namecheap subdomain root.
- Deployed the backend as the Google Cloud Run service `carequeue-api` in `us-central1`.
- Kept MongoDB Atlas as the persistence layer and supplied the MongoDB URI to Cloud Run through Google Secret Manager.
- Kept `EXPO_PUBLIC_API_URL` as a build-time public client setting and `EXPO_PUBLIC_USE_MOCK_DATA=true` as the only supported local mock-data path.

## Unresolved Questions

### Frontend And Shared Types

- How should feature folders evolve once the app adds outreach attempt forms, activity history, and authenticated user-specific views?
- Should a future backend introduce a formal monorepo workspace or shared package for API DTOs, or should frontend and backend remain separate package roots?
- Should Expo typed routes remain enabled once more routes are added?

### MongoDB Modeling

- Should records, interactions, outreach attempts, and assignments be separate collections or embedded documents for the MVP?
- Should MongoDB Atlas use private networking or remain publicly reachable with tightly scoped allowlists for this portfolio deployment?
- What long-term timezone policy should govern follow-up dates if write workflows are added?

### Authentication And Authorization

- What prototype authentication approach is appropriate before adding write workflows?
- How should role-based authorization be represented for care coordinators, clinicians, peer support, team leads, and administrators?

### Write Workflows And Auditability

- How should outreach attempts, assignment changes, and status updates be modeled?
- What audit trail is needed for write actions in a sensitive-domain workflow prototype?

### AI Integration

- Is an AI-generated draft summary in scope for the MVP, or should it remain a later milestone?
- What human-verification UI language is required before any draft summary is displayed?
- How should prompts and model outputs be tested using fictional notes only?

### Cloud Run Deployment

- Should future deployments use infrastructure as code instead of manual `gcloud` commands?
- Should CI/CD own Cloud Run deployments, static web exports, and cPanel upload packaging?
- What managed monitoring and alerting should be added for public uptime?

### Browser And Device Testing

- Should end-to-end browser tests run in CI against the exported Expo web build?
- What physical Android and iOS checks should be repeated before presenting the project publicly?
- What cache headers should be applied to `index.html` versus hashed Expo assets on the static host?
