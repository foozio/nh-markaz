# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- SQLite-backed persistence for user notes and Quran/Hadith bookmarks with per-user server actions.
- Structured JSON logging for Quran/Hadith fetches, AI events, and auth edge cases to aid observability.
- CI workflow (lint, typecheck, Vitest) plus smoke tests for Quran and Hadith data fetchers.
- NextAuth route and middleware to protect Quran/Hadith routes, and guarded AI features when `GEMINI_API_KEY` is missing.
- New documentation set (PRD, ERD, security evaluation, enhancement report, tasks) reflecting current system state.

### Changed
- Quran/Hadith API clients now use caching with retry/backoff; Hadith full-collection fetches are capped with truncation notice to improve performance.
- Notes content is sanitized on save/load to reduce XSS risk.
- README updated to reflect the SQLite storage location and runtime expectations.

### Security
- Added sanitization of rich-text notes before persistence and after load.
- Guarded AI summary calls when credentials are absent to avoid leaking errors to users.

## [0.1.0] - 2025-09-24

### Added
- Initial Next.js experience for browsing the Quran with contextual translations.
- Google authentication via NextAuth together with persistent personal notes stored in SQLite.
- Gemini-powered AI summaries with a custom persona tailored for Indonesian readers.
- Rich text editor improvements including toolbar controls, headings, and bookmark support.

### Changed
- Rebranded the application from Noor Al-Quran to Markaz with a full Indonesian interface refresh.

[unreleased]: https://github.com/foozio/nh-markaz/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/foozio/nh-markaz/releases/tag/v0.1.0
