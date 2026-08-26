# Product Brief

## Overview

Care Coordination Work Queue is an independent fictional prototype for organizing follow-up work across a multidisciplinary care team. It uses synthetic data only and is intended as a small portfolio project focused on workflow clarity, reliable full-stack implementation, and responsible handling of sensitive-domain concepts.

## Fictional Users

- Care coordinator: reviews assigned follow-ups, records outreach attempts, and updates follow-up status.
- Team lead: monitors queue health, identifies overdue work, and helps redistribute responsibility.
- Behavioral health clinician: reviews recent fictional interactions and contributes context when follow-up requires clinical awareness.
- Operations administrator: manages mock team roles, queue categories, and basic workflow configuration in later iterations.

## Operational Problem

Care teams often need to coordinate many follow-up tasks across roles, dates, statuses, and recent interactions. Without a clear queue, overdue work can become difficult to find, ownership can be unclear, and teams may lack a shared view of what has already been tried.

This prototype models that coordination problem without using real patient data or making clinical recommendations.

## Initial Workflow

1. A fictional staff user opens the work queue.
2. The queue displays synthetic records that need follow-up.
3. The user filters by status, urgency, role, owner, and follow-up timing.
4. The user opens a record to review recent fictional interaction history.
5. The user records a fictional outreach attempt or updates ownership/status.
6. The queue reflects the updated follow-up state.

## MVP

- Strict TypeScript codebase.
- React Native and React Native Web frontend.
- Node.js API.
- MongoDB persistence using synthetic seed data.
- Work queue list with filters for follow-up status, urgency, role, and timing.
- Record detail view with synthetic profile information and recent fictional interactions.
- Outreach attempt form with validation.
- Clear empty, loading, and error states.
- Basic automated tests for core filtering, validation, and API behavior.
- Basic structured logging and health check endpoint.

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

- All demo records must be synthetic and fictional.
- UI copy must clearly avoid asking for real patient information.
- Any future AI-generated summaries must be labeled as drafts requiring human verification.
- AI output must summarize only synthetic notes provided inside the prototype.
- The application must not present AI output as medical advice, risk assessment, diagnosis, or treatment guidance.
- Logs, fixtures, screenshots, and documentation must not contain real patient information.

## Technical Success Criteria

- The app can be run locally with documented commands after scaffolding is complete.
- Formatting, linting, type checking, and tests run successfully in the configured toolchain.
- Shared domain types are used consistently across frontend and backend boundaries.
- API inputs are validated at runtime before persistence.
- Queue filtering behavior is covered by automated tests.
- Error states are visible and recoverable in the UI.
- The backend exposes a health check endpoint.
- Logs provide enough context to debug request failures without exposing sensitive data.
- Deployment decisions for Google Cloud Run are documented before production-like deployment work begins.

## Milestones

### Day 1

- Establish repository documentation and decision log.
- Choose frontend, backend, package management, and workspace structure.
- Scaffold the smallest runnable strict TypeScript project.
- Add formatting, linting, type checking, and test scripts.

### Day 2

- Implement synthetic domain model and seed data.
- Build the initial work queue, filters, and record detail view.
- Add API endpoints for reading queue items and recording outreach attempts.
- Add focused tests for filtering, validation, and basic API behavior.

### Day 3

- Add polish for loading, empty, and error states.
- Add basic observability, health checks, and deployment notes.
- Review safety language and synthetic data boundaries.
- Prepare a concise project explanation of architecture, tradeoffs, tests, and next steps.
