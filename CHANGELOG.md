# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Completed the hadith reader experience by fetching full collections from api.hadith.gading.dev, paginating every ten entries, and enabling bookmarks plus notes.
- Introduced shared note management across Quran and Hadith, including quick insertion of text and AI summaries alongside dedicated sidebar editors.
- Added verse-level bookmarking and audio playback controls inside the Quran reader for faster navigation and listening.

### Changed
- Replaced the SQLite-backed note persistence with a temporary in-memory store while database compilation issues are resolved.
- Updated the global typography stack to use Noto Sans for improved readability across layouts.
- Polished navigation headers and sidebars to surface account controls and bookmark tabs.

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
