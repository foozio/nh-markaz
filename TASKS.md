# NH Markaz — Action Items

- [x] Add `/api/auth/[...nextauth]/route.ts` using `authOptions` and protect `/quran` and `/hadith` via middleware.
- [x] Replace in-memory notes storage with SQLite DB layer; add per-user bookmark persistence.
- [x] Introduce `.env.example` and align README with actual storage (remove Firestore mention or implement real backend).
- [x] Rework Hadith fetching to avoid full-collection loads (capped to 600 items with truncation notice); follow-up: real pagination/streaming and caching.
- [x] Add caching/error handling for Quran/Hadith fetchers and AI summaries with user-friendly fallbacks.
- [x] Re-enable TypeScript and ESLint checks in CI; add smoke tests for data fetchers.
- [x] Guard AI usage when `GEMINI_API_KEY` is missing; show user-friendly disabled message instead of hard failure.
- [x] Sanitize rich-text notes on save/load to reduce XSS risk.
- [x] Remove server-only markers from Quran/Hadith fetchers to keep client bundles clean.
- [x] Improve analytics/observability: structured logs for fetch failures, AI errors, and auth events.
