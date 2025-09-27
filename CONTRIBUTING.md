# Contributing

Thanks for contributing to NH Markaz! We’re excited to collaborate with the community. Please follow these steps to help us review and ship your changes quickly.

## Getting Started
1. Fork the repository and clone your fork locally.
2. Install dependencies with `npm install`.
3. Create a copy of `.env.example` and rename it to `.env`, then supply your Supabase credentials and optional Gemini API key.
4. Run `npm run dev` to ensure the project builds and starts.

## Development Workflow
- Create a feature branch from `main` (for example, `feature/add-surah-filter`).
- Make your changes with clear, descriptive commits.
- Before opening a pull request, run available checks:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test` (when tests are added)
- Provide context in your PR description and link any related issues.

## Code Style
- Use TypeScript and keep components typed.
- Prefer descriptive variable names and minimal comments unless clarification is needed.
- Keep files focused; extract shared logic into the `src/lib` or `src/components` directories where it fits best.

## Reporting Issues
- Search existing issues before opening a new one.
- Include reproduction steps, expected vs actual behaviour, and screenshots or logs when applicable.

We appreciate your help in improving NH Markaz!
