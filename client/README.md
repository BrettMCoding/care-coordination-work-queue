# Care Coordination Work Queue Client

This is the Expo frontend for Care Coordination Work Queue. It is a prototype that uses fictional data and does not include authentication or external AI API integration.

## Commands

```bash
npm run web
npm run build:web
npm run serve:web
npm run lint
npm run typecheck
npm run test
```

## Environment

Copy `.env.example` to `.env.local` for local development.

- `EXPO_PUBLIC_API_URL`: HTTPS URL for the Express API.
- `EXPO_PUBLIC_USE_MOCK_DATA`: set to `true` only when intentionally using local fictional fixtures.

## Implemented

- React Native and React Native Web through Expo.
- Expo Router with a single active work queue route.
- Strict TypeScript configuration.
- Fictional care-team work queue data.
- Filters for follow-up status and care-team role.
- Manual loading, empty, and error states.
- Static web export to `dist`.
- API service layer configured by `EXPO_PUBLIC_API_URL`.

## Not Implemented Yet

- Authentication.
- External AI integration.
