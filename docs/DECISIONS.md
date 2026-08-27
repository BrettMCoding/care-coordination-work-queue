# Architecture Decision Log

This log records settled decisions and unresolved architecture questions. Keep entries concise and update them as the project moves through small milestones.

## Decisions

### 2026-08-26: Frontend scaffold

- Created the frontend in `client/` with Expo SDK 57 using the official `create-expo-app` default TypeScript template.
- Kept the repository as a simple root project with a standalone frontend directory. Backend and shared packages are deferred until their scope is clearer.
- Used Expo Router because it is included in the default Expo template and supports React Native plus web routing from the same route tree.
- Replaced the starter tab example with a single active work queue route for Day 1. Additional routes will be added only when record details or other workflows are implemented.
- Added `npm run typecheck` in the client so strict TypeScript can be validated separately from linting.
- Kept all Day 1 data local, typed, synthetic, and frontend-only. No backend, database, authentication, or external AI API was added.

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
- Added `GET /readyz` for MongoDB connectivity while keeping `GET /healthz` independent of the database.
- Modeled the backend API around the existing client queue fields: client alias, team roles, last contact, next follow-up, status, and urgency.
- Added `GET /api/cases` with status, role, urgency, search, and sort query parameters. The current client uses status and role filters.
- Added `GET /api/cases/:id` for typed case detail retrieval even though the current UI has not added a detail route yet.
- Used Zod for environment, query, route-parameter, and future request-body validation.
- Added a safe repeatable synthetic seed command that upserts known fictional cases by stable IDs.
- Added MongoDB indexes for status/date, assigned role/date, urgency/date, and text search.
- Added CORS allowlist configuration for localhost development origins and the production web origin.
- Added a production Dockerfile for the server using a Node 24 image and a non-root runtime user.
- Kept client mock data behind explicit `EXPO_PUBLIC_USE_MOCK_DATA=true`; the normal client path calls the configured API and does not silently fall back.

## Unresolved Questions

### Frontend Structure

- How should feature folders evolve once the app adds record detail, outreach attempt forms, and shared domain types?
- Should a future backend introduce a formal monorepo workspace, or should frontend and backend remain separate package roots?
- Should Expo typed routes remain enabled once more routes are added?

### Backend Framework

- How much route-level structure is needed once case and outreach APIs are added?
- Should future API modules be organized by feature, by HTTP route, or by domain service boundary?

### MongoDB Modeling

- Should records, interactions, outreach attempts, and assignments be separate collections or embedded documents for the MVP?
- How should synthetic seed data be loaded and reset during local development?
- What indexes are needed for follow-up timing, status, urgency, and owner filters?

### API Validation

- Which runtime validation library should be used for request and response boundaries?
- Should validation schemas also drive shared TypeScript types?
- How should validation errors be shaped for the frontend?

### Testing

- Which unit test runner should be used across frontend and backend?
- What level of integration testing is necessary for MongoDB-backed API behavior?
- Should UI tests use React Native Testing Library, Playwright for web, or both?

### Observability

- What structured logging library should the backend use?
- What request identifiers or correlation fields are useful for local debugging and future deployment?
- What health check and readiness endpoints are needed for Cloud Run?

### AI Integration

- Is an AI-generated draft summary in scope for the MVP, or should it remain a later milestone?
- What human-verification UI language is required before any draft summary is displayed?
- How should prompts and model outputs be tested using synthetic notes only?

### Cloud Run Deployment

- Should the frontend be deployed separately from the API, or should the API serve the web build?
- How will environment variables and sensitive deployment configuration be managed?
- What deployment path keeps costs low and the architecture easy to explain?

### Static Web Hosting

- Which static hosting provider will serve `client/dist` at `https://carequeue.brettmarshmakesthings.com`?
- What cache headers should be applied to `index.html` versus hashed Expo assets?
- Should a deployment ZIP naming convention be documented once a hosting provider is selected?
