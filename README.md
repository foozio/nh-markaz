# NH Markaz

NH Markaz is an open-source Quran study assistant built with Next.js. It pairs rich Quran browsing with personal note taking and GenAI-powered insights so learners can organise reflections in one place.

## Features
- Quran browser with translations and rich verse context
- Secure Firebase Authentication for sign-in
- Persistent personal notes stored locally with SQLite
- Optional Gemini integration for AI-assisted summaries

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
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase application ID |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID (optional) |

## Database
The project uses SQLite for storing personal notes. The database file is automatically created at `data/notes.db` and is ignored by Git.

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
