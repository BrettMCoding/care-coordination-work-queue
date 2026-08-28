# API

The API serves fictional work queue data only. It is not a clinical decision-making system and must not receive real patient information.

Base URLs:

- Local: `http://localhost:8080`
- Production: `https://carequeue-api-2gctn4p6ia-uc.a.run.app`

## Error Shape

All handled errors use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "requestId": "request-id",
    "details": []
  }
}
```

`details` is optional. Production responses do not expose stack traces.

## `GET /health`

Lightweight process health check. Does not touch MongoDB.

Example response:

```json
{
  "status": "ok",
  "service": "care-coordination-work-queue-api",
  "timestamp": "2026-08-28T00:00:00.000Z"
}
```

## `GET /ready`

Readiness check. Verifies MongoDB connectivity.

Example success response:

```json
{
  "status": "ready",
  "service": "care-coordination-work-queue-api",
  "timestamp": "2026-08-28T00:00:00.000Z"
}
```

Example failure response:

```json
{
  "error": {
    "code": "DATABASE_NOT_READY",
    "message": "Database connectivity check failed.",
    "requestId": "request-id"
  }
}
```

## `GET /api/cases`

Returns work queue cases.

Query parameters:

- `status`: optional. One of `overdue`, `due-soon`, `scheduled`, `waiting`, `completed`.
- `role`: optional. One of `care-coordinator`, `clinician`, `peer-support`, `team-lead`.
- `urgency`: optional. One of `routine`, `elevated`, `urgent`.
- `search`: optional text search, 1 to 80 characters.
- `sortBy`: optional. One of `clientAlias`, `lastContactDate`, `nextFollowUpDate`, `status`, `urgency`. Defaults to `nextFollowUpDate`.
- `sortDirection`: optional. `asc` or `desc`. Defaults to `asc`.

Example request:

```text
GET /api/cases?status=overdue&role=care-coordinator
```

Example response:

```json
{
  "data": [
    {
      "id": "case-001",
      "clientAlias": "River H.",
      "context": "Needs follow-up after missed intake paperwork.",
      "assignedTeam": [
        {
          "name": "Mina Patel",
          "role": "care-coordinator"
        }
      ],
      "lastContactDate": "2026-08-20",
      "nextFollowUpDate": "2026-08-26",
      "status": "overdue",
      "urgency": "urgent"
    }
  ],
  "meta": {
    "count": 1,
    "filters": {
      "role": "care-coordinator",
      "search": null,
      "status": "overdue",
      "urgency": null
    },
    "sort": {
      "by": "nextFollowUpDate",
      "direction": "asc"
    }
  }
}
```

Returned case dates roll relative to the current day for demo continuity. Example dates are illustrative and should not be treated as permanently current values.

## `GET /api/cases/:id`

Returns one fictional case by ID.

Example request:

```text
GET /api/cases/case-001
```

Example response:

```json
{
  "data": {
    "id": "case-001",
    "clientAlias": "River H.",
    "context": "Needs follow-up after missed intake paperwork.",
    "assignedTeam": [
      {
        "name": "Mina Patel",
        "role": "care-coordinator"
      }
    ],
    "lastContactDate": "2026-08-20",
    "nextFollowUpDate": "2026-08-26",
    "status": "overdue",
    "urgency": "urgent"
  }
}
```

Example not found response:

```json
{
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "Work queue case was not found.",
    "requestId": "request-id"
  }
}
```

## Unimplemented Endpoints

The current API is read-only. It does not expose write endpoints for outreach attempts, assignment changes, status updates, authentication, authorization, or audit history.
