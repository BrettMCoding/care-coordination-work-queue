# Product Brief

## Overview

Care Coordination Work Queue is an independent fictional prototype for organizing follow-up work across a multidisciplinary care team. It uses fictional data only and is intended as a small portfolio project focused on workflow clarity, reliable full-stack implementation, and responsible handling of sensitive-domain concepts.

The current deployed milestone is a read-only full-stack application: users can review a queue, filter it, inspect case details, and see clear loading, empty, error, and retry states. It does not yet support write workflows.

## Fictional Users

- Care coordinator: reviews assigned follow-ups and identifies records needing attention.
- Team lead: monitors queue health, identifies overdue work, and helps redistribute responsibility.
- Behavioral health clinician: reviews recent fictional context and contributes perspective when follow-up requires clinical awareness.
- Operations administrator: manages mock team roles, queue categories, and basic workflow configuration in later iterations.

## Operational Problem

Care teams often need to coordinate many follow-up tasks across roles, dates, statuses, and recent interactions. Without a clear queue, overdue work can become difficult to find, ownership can be unclear, and teams may lack a shared view of what has already been tried.

This prototype models that coordination problem without using real patient data or making clinical recommendations.

## Implemented Core Milestone

- Strict TypeScript codebase.
- React Native and React Native Web frontend through Expo.
- Static Expo web deployment.
- Node.js and Express API.
- MongoDB Atlas persistence using fictional seed data.
- Google Cloud Run backend deployment.
- Work queue list with filters for follow-up status and care-team role.
- Summary counts for visible, overdue, and urgent cases.
- Read-only case-detail modal.
- API endpoints for listing cases and reading one case by ID.
- Runtime validation for API input.
- Clear loading, empty, error, and retry states.
- Rolling fictional follow-up dates for demo continuity.
- Structured logging, request IDs, health checks, and readiness checks.
- Focused automated tests for client API behavior, query logic, modal state logic, route behavior, validation, repository logic, and rolling dates.

## Future Workflow Ambitions

- Record outreach attempts.
- Update follow-up status.
- Reassign ownership.
- Show richer activity and interaction history.
- Add authenticated user context.
- Add role-based authorization.
- Add audit history for write actions.
- Add carefully bounded AI-assisted summaries, if appropriate later.

These items are not implemented in the current deployed application.

## Non-Goals

- No real patient, client, member, or protected health information.
- No automated diagnoses.
- No treatment recommendations.
- No suicide-risk scoring or clinical decision-making.
- No claim of HIPAA compliance.
- No production-readiness claim.
- No measured outcome claims unless actually measured later.
- No public association with any real healthcare company.
- No authentication beyond a clearly labeled prototype approach unless explicitly scoped later.

## Safety And Privacy Boundaries

- All demo records must be fictional.
- UI copy must clearly avoid asking for real patient information.
- Any future AI-generated summaries must be labeled as drafts requiring human verification.
- AI output must summarize only fictional notes provided inside the prototype.
- The application must not present AI output as medical advice, risk assessment, diagnosis, or treatment guidance.
- Logs, fixtures, screenshots, and documentation must not contain real patient information.

## Technical Success Criteria

- The app can be run locally with documented commands.
- The public web client is deployed at the dedicated subdomain.
- The public API is deployed on Cloud Run.
- MongoDB Atlas stores the fictional work queue data.
- Formatting, linting, type checking, and tests run successfully in the configured toolchains.
- Shared domain concepts are used consistently across frontend and backend boundaries.
- API inputs are validated at runtime before database queries.
- Queue filtering behavior is covered by automated tests.
- Error states are visible and recoverable in the UI.
- The backend exposes separate health and readiness endpoints.
- Logs provide enough request context to debug failures without exposing sensitive data.
- Deployment and remaining production-hardening decisions are documented.

## Milestones

### Completed Core Prototype

- Established repository documentation and decision log.
- Scaffolded strict TypeScript frontend and backend packages.
- Built the read-only work queue, filters, summary counts, and case-detail modal.
- Added API endpoints for reading queue items and case details.
- Added MongoDB-backed persistence with repeatable fictional seed data.
- Added automated tests for key client and server behavior.
- Added health/readiness endpoints, structured logging, Docker support, and deployment notes.
- Deployed the static frontend and Cloud Run API.

### Future Milestones

- Add authenticated prototype users and role-based authorization.
- Add write endpoints and forms for outreach attempts and status changes.
- Add activity history and auditability.
- Add CI/CD and infrastructure as code.
- Add deeper browser/device end-to-end testing.
- Revisit AI integration only with clear safety, privacy, and human-review boundaries.
