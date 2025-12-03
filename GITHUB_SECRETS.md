# NH Markaz — GitHub Secrets / Env Vars

| Name | Required | Scope | Description / Usage |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Optional (needed for AI) | Genkit / Gemini | API key for Gemini model calls used in verse/hadith summaries. |
| `NEXTAUTH_URL` | Required | NextAuth | Base URL for auth callbacks (e.g. `http://localhost:9002` in dev). |
| `NEXTAUTH_SECRET` | Required | NextAuth | Secret for signing NextAuth JWTs. Use a long random string. |
| `GOOGLE_CLIENT_ID` | Required | NextAuth | Google OAuth client ID for login. |
| `GOOGLE_CLIENT_SECRET` | Required | NextAuth | Google OAuth client secret. |

## Management Notes
- Store secrets as GitHub Actions/Pages environment secrets or deployment platform vars; never commit to VCS.
- Provide `.env.example` with placeholders and document local setup.
- Rotate OAuth and API keys if exposure is suspected; update deployments accordingly.
