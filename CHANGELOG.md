# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed ReferenceError: getCachedSearchResults is not defined by migrating cached API functions to server-side routes
- Standardized header spacing consistency across all pages (Quran, Hadith, Search)
- Fixed Quran dropdown to properly display verse count for all surahs
- Improved search architecture by separating client-side components from server-side database operations
- Enhanced SQLite caching mechanism for better performance and reliability

## [0.2.0] - 2025-01-27

### Added
- Scaffolded hadith integration via api.hadith.gading.dev with collections index and detail pages.
- Completed the hadith reader experience by fetching full collections from api.hadith.gading.dev, paginating every ten entries, and enabling bookmarks plus notes.
- Introduced a hadith workspace featuring rich notes, bookmarking, AI summaries, and sharing controls.
- Introduced shared note management across Quran and Hadith, including quick insertion of text and AI summaries alongside dedicated sidebar editors.
- Added verse-level bookmarking and audio playbook controls inside the Quran reader for faster navigation and listening.
- Unified Arabic typography across Quran and Hadith experiences using the dedicated Noto Naskh font.
- Comprehensive search functionality for Al-Quran and Hadith with Indonesian interface.
- Multi-language search support (Arabic, Indonesian, transliteration) with intelligent matching.
- Search result highlighting and pagination for better user experience.
- Search suggestions and auto-complete functionality.
- Consistent design integration with existing application theme.

### Changed
- Replaced Firebase authentication with NextAuth-powered Google sign-in and removed Firebase-specific configuration.
- Replaced the SQLite-backed note persistence with a temporary in-memory store while database compilation issues are resolved.
- Updated the global typography stack to use Noto Sans for improved readability across layouts.
- Polished navigation headers and sidebars to surface account controls and bookmark tabs.
- Refreshed environment samples and contributor documentation to highlight the new authentication flow.
- Updated main navigation menu from Arabic to Indonesian language.
- Improved search input layout to prevent overlapping UI elements.

## [0.1.0] - 2025-09-24

### Added
- Initial Next.js experience for browsing the Quran with contextual translations.
- Google authentication via NextAuth together with persistent personal notes stored in SQLite.
- Gemini-powered AI summaries with a custom persona tailored for Indonesian readers.
- Rich text editor improvements including toolbar controls, headings, and bookmark support.

### Changed
- Rebranded the application from Noor Al-Quran to Markaz with a full Indonesian interface refresh.

[unreleased]: https://github.com/foozio/nh-markaz/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/foozio/nh-markaz/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/foozio/nh-markaz/releases/tag/v0.1.0
