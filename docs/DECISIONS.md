# Architecture Decision Log

This log records settled decisions and unresolved architecture questions. Keep entries concise and update them as the project moves through small milestones.

## Decisions

No architecture decisions have been finalized yet.

## Unresolved Questions

### Frontend Structure

- Should the app use Expo with React Native Web, or a custom React Native Web setup?
- Should frontend and backend live in a monorepo workspace from the start?
- What navigation pattern is appropriate for a small queue-and-detail workflow?

### Backend Framework

- Should the Node.js API use Express, Fastify, Hono, or another minimal framework?
- Should the backend be structured by feature, route, or layered service modules?

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
- What health check and readingit add .ess endpoints are needed for Cloud Run?

### AI Integration

- Is an AI-generated draft summary in scope for the MVP, or should it remain a later milestone?
- What human-verification UI language is required before any draft summary is displayed?
- How should prompts and model outputs be tested using synthetic notes only?

### Cloud Run Deployment

- Should the frontend be deployed separately from the API, or should the API serve the web build?
- How will environment variables and secrets be managed?
- What deployment path keeps costs low and the architecture easy to explain?
