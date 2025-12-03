# NH Markaz — Enhancement Report

## Current State
- Next.js 15 app with Quran and experimental Hadith browsing, AI summaries via Genkit/Gemini, and rich-text notes.
- AuthProvider redirects unauthenticated users, but NextAuth API route is missing; notes persist only in memory/localStorage.
- External data pulled directly from public APIs; build config skips type/lint failures.

## Key Gaps
- No durable persistence for notes/bookmarks; in-memory Maps reset on deploy.
- Google sign-in flow incomplete without `/api/auth/[...nextauth]`.
- Hadith detail page fetches entire collections, risking latency and rate limits.
- Server action/env validation is runtime-only; missing startup checks and CI safety nets.
- Limited observability and resilience around external API/AI failures.

## Recommended Enhancements (priority)
1) Implement persistent storage (SQLite/Postgres/Supabase) for notes/bookmarks with migrations and per-user scoping.  
2) Add NextAuth route handler, middleware guarding protected paths, and env schema validation.  
3) Rework Hadith fetching to server-paginate/cache instead of loading all entries at once.  
4) Tighten build hygiene: enable type/lint in CI, add minimal tests for data fetchers and server actions.  
5) Add error boundaries, user-facing fallbacks, and retry/backoff for Quran/Hadith/AI calls.  

## Quick Wins
- Provide `.env.example` and GitHub secrets mapping.  
- Surface loading/skeleton states for surah list and AI failures; cache surah list server-side.  
- Normalize bookmark storage format for Quran and Hadith and sync to server when persistence arrives.  
