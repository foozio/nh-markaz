# NH Markaz — Product Requirements

## Objective
- Deliver a reliable Quran and Hadith study assistant for Indonesian readers with authenticated access, rich note-taking, bookmarking, and AI-assisted summaries.

## Target Users
- Students and lay readers seeking guided study with translation.
- Teachers/mentors curating passages with sharable notes.
- Researchers needing quick navigation, search, and export of references.

## User Value & Scenarios
- Browse any surah/ayah with Arabic, transliteration, and Indonesian translation.
- Add personal notes per user; capture AI summaries and verse/hadith snippets.
- Bookmark and recall favorite verses/hadith, with quick navigation.
- Explore hadith collections with paging; read and annotate entries.
- Sign in with Google for personalized storage and sync.

## Scope (MVP)
- Auth: Google OAuth via NextAuth; session persistence; protected Quran/Hadith areas.
- Quran: List surahs, view verses with audio playback, bookmarking, AI summary per verse, add to notes.
- Notes: Rich-text editor; per-user persistence; save/load actions; basic toast feedback.
- Hadith: List collections; view entries by collection with pagination; bookmarking; AI summaries; add to notes.
- Landing: Marketing page with CTA to sign in.

## Future Out-of-Scope (vNext)
- Collaborative/shared notebooks; export to PDF.
- Offline mode; mobile apps.
- Advanced search/filtering, tafsir sources, multi-language UI.
- Admin content management or custom AI models.

## Functional Requirements
- R1: Protect authenticated routes; unauthenticated users redirected to `/login`.
- R2: Server-side session retrieval in layout to hydrate client auth context.
- R3: Quran data fetched from api.quran.gading.dev with caching to reduce calls.
- R4: Verse actions: play audio, bookmark, request AI summary, append to notes.
- R5: Notes: create/update rich text; per-user storage; manual save; optimistic UI.
- R6: Hadith: list collections; open collection detail; paginate entries; bookmark and annotate entries; AI summary per entry.
- R7: AI: optional Gemini-powered summarization; handle missing API key gracefully.
- R8: Accessibility: semantic landmarks, ARIA labels on interactive icons.

## Non-Functional Requirements
- Performance: initial Quran load <2s on broadband; API calls cached when possible.
- Reliability: notes and bookmarks must persist across sessions; avoid in-memory-only storage.
- Security: secrets kept in env; server actions authorize user identity before writes.
- Observability: basic logging for failed fetches and AI errors.

## Success Metrics
- Activation: % of new users who read ≥1 surah and save ≥1 note in first session.
- Retention: users returning within 7 days with existing notes/bookmarks.
- AI usage: share of sessions triggering ≥1 AI summary; error rate <2%.
- Stability: <1% failed external API calls surfaced to users.

## Dependencies
- Next.js 15 (App Router), NextAuth (Google), api.quran.gading.dev, api.hadith.gading.dev, Gemini API via Genkit, TipTap editor, shadcn/ui components.

## Risks & Mitigations
- External API latency/limits → add caching, progressive loading, and fallbacks.
- In-memory persistence → replace with durable DB (SQLite/Postgres/Supabase/Firebase).
- AI API failures → graceful degradation and user-facing copy.
- Missing NextAuth route/config → add `/api/auth/[...nextauth]` handler and env validation.
