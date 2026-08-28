# Architecture

Care Coordination Work Queue is a fictional-data portfolio prototype. It is not a production clinical system, does not process real patient information, and does not provide diagnoses, treatment recommendations, risk scoring, or medical advice.

## Runtime Shape

- `client/`: Expo, React Native, React Native Web, Expo Router, and TypeScript.
- `server/`: Node.js, Express, TypeScript, Zod, Pino, and the official MongoDB Node.js driver.
- Database: MongoDB Atlas, using a `workQueueCases` collection seeded with fictional records.
- Backend hosting target: Google Cloud Run.
- Web hosting target: static Expo export at `https://carequeue.brettmarshmakesthings.com`.

## Request Flow

1. A user opens the static web client.
2. The queue screen calls the client API service layer.
3. The service reads `EXPO_PUBLIC_API_URL` and sends a request such as `GET /api/cases?status=overdue&role=care-coordinator`.
4. Cloud Run receives the request and forwards it to the server container on the `PORT` environment variable.
5. Express assigns or preserves `x-request-id`.
6. Pino logs the request with the same request ID.
7. CORS validates the request origin against the configured allowlist.
8. Zod validates route parameters and query parameters.
9. The work queue route calls the service layer.
10. The service calls the repository.
11. The repository uses the reused MongoDB client to query `workQueueCases`.
12. The API maps MongoDB documents to public response DTOs and returns JSON.
13. The client renders loading, empty, error, retry, and data states without silently falling back to mock data.

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

The backend does not store real patient information, credentials, authentication tokens, or AI outputs.

## Reliability Boundaries

- `/health` checks only whether the server process can respond.
- `/ready` checks MongoDB connectivity.
- MongoDB connections are reused across requests.
- The server listens on `0.0.0.0` and respects Cloud Run's `PORT`.
- Shutdown handlers close the HTTP server and MongoDB connection on `SIGTERM` and `SIGINT`.

## Security And Production-Hardening Limitations

This is not production-ready. Known limitations:

- No authentication or authorization.
- No rate limiting.
- No CSRF protection because no cookie-based auth exists yet.
- No audit trail.
- No real clinical privacy compliance claim.
- No infrastructure-as-code.
- No automated deployment pipeline.
- No managed observability dashboard configuration.
- CORS limits browser origins but is not an authentication control.
- MongoDB Atlas network access, users, backups, and rotation policies must be configured outside this repository.
