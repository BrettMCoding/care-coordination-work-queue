# Architecture

Care Coordination Work Queue is a fictional-data portfolio prototype. It is not a production clinical system, does not process real patient information, and does not provide diagnoses, treatment recommendations, risk scoring, or medical advice.

## Runtime Shape

- `client/`: Expo, React Native, React Native Web, Expo Router, and TypeScript.
- Frontend hosting: static Expo web export served from Namecheap cPanel at `https://carequeue.brettmarshmakesthings.com`.
- `server/`: Node.js, Express, TypeScript, Zod, Pino, and the official MongoDB Node.js driver.
- Backend hosting: Google Cloud Run service `carequeue-api` in `us-central1`.
- Public API base URL: `https://carequeue-api-2gctn4p6ia-uc.a.run.app`.
- Database: MongoDB Atlas, using a `workQueueCases` collection seeded with fictional records.
- Secrets: Cloud Run receives `MONGODB_URI` from Google Secret Manager.

## Request Flow

1. A user opens the static web client.
2. The queue screen calls the client API service layer.
3. The service reads `EXPO_PUBLIC_API_URL`.
4. For the list view, the client sends `GET /api/cases` with query parameters such as `status`, `role`, `urgency`, `search`, `sortBy`, and `sortDirection`.
5. When the user selects `View details`, the client sends `GET /api/cases/:id`.
6. Cloud Run receives the request and forwards it to the server container on the `PORT` environment variable.
7. Express assigns or preserves `x-request-id`.
8. Pino logs the request with the same request ID.
9. CORS validates browser origins against the configured allowlist.
10. Zod validates route parameters and query parameters.
11. The work queue route calls the service layer.
12. The service calls the repository.
13. The repository reuses the process-level MongoDB client to query `workQueueCases`.
14. The API maps MongoDB documents to public response DTOs, applies rolling demo dates, and returns JSON.
15. The client renders loading, empty, error, retry, list, and modal-detail states without silently falling back to mock data.

## Data Flow

The seed command writes only fictional cases. Each case stores:

- Stable case ID.
- Fictional client alias.
- Fictional context note.
- Assigned fictional team members and roles.
- Last contact date.
- Next follow-up date.
- Follow-up status.
- Urgency label.

The API intentionally maps case dates to stable offsets from the current day before returning data. This keeps the deployed demo coherent over time: overdue cases stay overdue, due-soon cases stay due soon, and scheduled cases remain upcoming.

This rolling-date behavior is for demo continuity only. In a real operational system, persisted dates should represent actual events and should not move automatically.

The backend does not store real patient information, credentials, authentication tokens, or AI outputs.

## Reliability Boundaries

- `/health` checks only whether the server process can respond.
- `/ready` checks MongoDB connectivity.
- MongoDB connections are reused across requests.
- The server listens on `0.0.0.0` and respects Cloud Run's `PORT`.
- Shutdown handlers close the HTTP server and MongoDB connection on `SIGTERM` and `SIGINT`.
- The Express app is separated from the process entry point so routes can be tested without opening a network port.

## Security And Production-Hardening Limitations

This is not production-ready. Known limitations:

- No authentication or authorization.
- No user-specific access control.
- No write workflow, audit trail, or immutable activity history.
- No rate limiting or abuse protection.
- No CSRF protection because no cookie-based authentication exists.
- No claim of HIPAA compliance or clinical privacy compliance.
- No infrastructure as code.
- No automated deployment pipeline.
- No managed alerting configuration.
- CORS limits browser origins but is not an authentication control.
- MongoDB Atlas network access, backup policy, rotation policy, and private connectivity require production-specific configuration outside this repository.
