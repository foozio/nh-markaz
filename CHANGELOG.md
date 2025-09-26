# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-01-27

### Added
- Scaffolded hadith integration via api.hadith.gading.dev with collections index and detail pages.
- Introduced a hadith workspace featuring rich notes, bookmarking, AI summaries, and sharing controls.
- Unified Arabic typography across Quran and Hadith experiences using the dedicated Noto Naskh font.
- Comprehensive search functionality for Al-Quran and Hadith with Indonesian interface.
- Multi-language search support (Arabic, Indonesian, transliteration) with intelligent matching.
- Search result highlighting and pagination for better user experience.
- Search suggestions and auto-complete functionality.
- Consistent design integration with existing application theme.

### Changed
- Replaced Firebase authentication with NextAuth-powered Google sign-in and removed Firebase-specific configuration.
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
