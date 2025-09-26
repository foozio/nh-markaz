# NH Markaz

NH Markaz is an open-source Quran study assistant built with Next.js. It pairs rich Quran browsing with personal note taking and GenAI-powered insights so learners can organise reflections in one place.

## Features
- **Quran & Hadith Browser**: Rich browsing experience with translations and verse context
- **Advanced Search**: Comprehensive search functionality for Al-Quran and Hadith with Indonesian interface
- **Multi-language Support**: Search in Arabic, Indonesian, and transliteration with intelligent matching
- **SQLite Caching**: High-performance caching system for faster search and data retrieval
- **Secure Authentication**: Google sign-in powered by NextAuth
- **Personal Notes**: Persistent note-taking for Quran and Hadith with rich text editor
- **Bookmarking System**: Verse-level bookmarking with audio playback controls
- **AI Integration**: Optional Gemini-powered summaries and insights
- **Responsive Design**: Consistent UI across desktop and mobile devices

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the required values.
3. Start the development server
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:9002` in your browser.

## Environment Variables
The following values are required:

| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key (optional if you disable AI features) |
| `NEXTAUTH_URL` | Base URL used by NextAuth callbacks (e.g. `http://localhost:9002`) |
| `NEXTAUTH_SECRET` | Strong random string for signing NextAuth JWTs |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Database
The project uses SQLite for multiple purposes:
- **Personal Notes**: User notes and bookmarks stored in `data/notes.db`
- **Search Cache**: Quran and Hadith content cached in `data/cache.db` for faster search performance
- **Auto-refresh**: Cache automatically updates to ensure data freshness

All database files are automatically created and ignored by Git for security.

## Scripts
- `npm run dev` – start the Next.js dev server on port 9002
- `npm run build` – build the production bundle
- `npm run start` – serve the production bundle
- `npm run lint` – run ESLint (configure on first run)
- `npm run typecheck` – TypeScript validation

## Contributing
We welcome contributions! Please read `CONTRIBUTING.md` and follow the code of conduct before opening an issue or pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.
