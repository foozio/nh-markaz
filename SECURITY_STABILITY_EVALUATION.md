# NH Markaz — Security & Stability Evaluation

## Authentication & Authorization
- **Missing NextAuth route**: No `/api/auth/[...nextauth]` handler, so Google sign-in will fail. Add the route and wrap protected server actions with session checks.
- **Session handling**: Layout fetches session server-side and hydrates client context—good pattern. Lacks middleware to gate routes early.
- **Env validation**: `getRequiredEnv` throws at runtime but without startup checks; prefer boot-time validation to avoid partial failures.

## Data Persistence
- **In-memory notes**: `lib/firestore.ts` stores notes in Maps; data is lost between deploys and not per-environment. Replace with durable storage (SQLite/Postgres/Supabase/Firebase) and migration strategy.
- **Bookmarks**: Quran bookmarks stored only in client state; Hadith bookmarks in localStorage. No server sync or multi-device continuity.

## External Integrations
- **API trust**: Quran/Hadith APIs called client-side; errors are logged but not surfaced with fallbacks. Add retry/backoff, user-friendly errors, and cache headers.
- **AI safety**: Gemini key optional; no guardrails or content filtering. Add usage caps and clearer messaging on AI failures.

## Stability & Performance
- **NextConfig ignores build errors/lint**: `ignoreBuildErrors` and `ignoreDuringBuilds` hide regressions. Turn off for CI to catch type/runtime issues.
- **Hadith full collection fetch**: `getCompleteHadithCollection` pulls entire collections (possibly hundreds/thousands) on each request; risks timeouts and rate limits. Implement pagination or server-side caching.
- **Client/server boundaries**: Server-only modules (`'use server'`) are imported from client components; validate Next.js 15 action support and consider API routes for heavy fetches.
- **Audio playback**: No graceful handling for unavailable audio URLs; add feature detection and fallback messaging.

## Observability & Operations
- **Logging**: Only `console.error` is used; no request tracing or structured logs. Add minimal logging wrappers and error boundary UI.
- **Rate limiting**: None for server actions; consider per-user throttling for AI summary endpoints.
- **Backups**: None while using in-memory storage; plan DB backups once persistence lands.
