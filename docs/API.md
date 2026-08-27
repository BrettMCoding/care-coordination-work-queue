# API

The API serves synthetic work queue data only. It is not a clinical decision-making system and must not receive real patient information.

Base URL examples:

- Local: `http://localhost:8080`
- Production placeholder: `https://CAREQUEUE_API_SERVICE_URL`

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

## `GET /healthz`

Lightweight process health check. Does not touch MongoDB.

Response:

```json
{
  "status": "ok",
  "service": "care-coordination-work-queue-api",
  "timestamp": "2026-08-26T00:00:00.000Z"
}
```

## `GET /readyz`

Readiness check. Verifies MongoDB connectivity.

Success response:

```json
{
  "status": "ready",
  "service": "care-coordination-work-queue-api",
  "timestamp": "2026-08-26T00:00:00.000Z"
}
```

Failure response:

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

Example:

```text
GET /api/cases?status=overdue&role=care-coordinator
```

Response:

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
      "nextFollowUpDate": "2026-08-24",
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

## `GET /api/cases/:id`

Returns one synthetic case by ID.

Example:

```text
GET /api/cases/case-001
```

Response:

```json
{
  "data": {
    "id": "case-001",
    "clientAlias": "River H.",
    "context": "Needs follow-up after missed intake paperwork.",
    "assignedTeam": [],
    "lastContactDate": "2026-08-20",
    "nextFollowUpDate": "2026-08-24",
    "status": "overdue",
    "urgency": "urgent"
  }
}
```

Not found:

```json
{
  "error": {
    "code": "CASE_NOT_FOUND",
    "message": "Work queue case was not found.",
    "requestId": "request-id"
  }
}
```
