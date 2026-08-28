# Care Coordination Work Queue Client

This is the Expo frontend for Care Coordination Work Queue. It is deployed as a static React Native Web export and normally reads fictional work queue data from the deployed Express API.

The client does not include authentication, authorization, write workflows, or external AI API integration.

## Commands

```bash
npm run web
npm run build:web
npm run serve:web
npm run lint
npm run typecheck
npm test
```

## Environment

Copy `.env.example` to `.env.local` for local development.

- `EXPO_PUBLIC_API_URL`: HTTPS URL for the Express API. This value is embedded during static web export.
- `EXPO_PUBLIC_USE_MOCK_DATA`: set to `true` only when intentionally using local fictional fixtures.

Example:

```env
EXPO_PUBLIC_API_URL=https://carequeue-api-2gctn4p6ia-uc.a.run.app
EXPO_PUBLIC_USE_MOCK_DATA=false
```

Do not commit `.env.local` or any file containing secrets.

## Implemented

- React Native and React Native Web through Expo.
- Expo Router with a single active work queue route.
- Strict TypeScript configuration.
- API service layer for list and detail requests.
- Explicit mock mode for local fixtures.
- Status and care-team-role filters.
- Summary counts for visible, overdue, and urgent cases.
- Loading, empty, error, and retry states.
- Explicit `View details` action on each card.
- Shared React Native modal for case detail on web, Android, and iOS.
- Rolling fictional dates for demo continuity.
- Static web export to `dist`.

## Web Export

Run the development server:

```bash
npm run web
```

Create a static production export:

```bash
npm run build:web
```

Preview the exported `dist` directory:

```bash
npm run serve:web
```

For cPanel hosting, upload the contents of `dist` to the subdomain document root.
