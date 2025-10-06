# Setup Guide

## Prerequisites

Before setting up Markaz, ensure you have the following installed:

- **Node.js 18+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Git** - Version control

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/foozio/nh-markaz.git
cd nh-markaz
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration (Optional)
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized
3. Copy the project URL and API keys from the project settings

#### Database Schema

Run the database migrations:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

The migrations will create the necessary tables:
- `user_notes` - For storing user notes and bookmarks

#### Authentication Setup

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google OAuth provider
3. Configure OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URIs: `https://your-domain.com/auth/callback`

### 5. AI Integration (Optional)

#### Google Gemini Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file as `GEMINI_API_KEY`

**Note:** AI features are optional. The app will work without the Gemini API key, but AI summaries will be disabled.

### 6. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 7. Build for Production

```bash
npm run build
npm start
```

## Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No |

### Database Configuration

The application uses SQLite for local caching and Supabase for user data:

- **Cache Database**: `data/cache.db` - Automatically created
- **Notes Database**: `data/notes.db` - Automatically created
- **User Data**: Stored in Supabase PostgreSQL

### External API Dependencies

Markaz depends on external APIs for content:

- **Quran API**: `https://api.quran.gading.dev`
- **Hadith API**: `https://api.hadith.gading.dev`
- **Search API**: `https://api.alquran.cloud`

These APIs are free and don't require authentication.

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run genkit:dev` | Start AI development server |
| `npm run genkit:watch` | Watch mode for AI development |

## Troubleshooting

### Common Issues

#### Build Errors

**Issue:** `Module not found` errors
**Solution:** Ensure all dependencies are installed with `npm install`

#### Database Connection

**Issue:** Cannot connect to Supabase
**Solution:** Check your environment variables and Supabase project status

#### AI Features Not Working

**Issue:** AI summaries not generating
**Solution:** Verify `GEMINI_API_KEY` is set correctly

#### Authentication Issues

**Issue:** Google sign-in not working
**Solution:** Check OAuth configuration in Supabase and Google Cloud Console

### Development Tips

- Use `npm run typecheck` frequently to catch TypeScript errors
- Enable React Developer Tools for debugging
- Check browser console for client-side errors
- Use Supabase dashboard to monitor database queries

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

1. Build the application: `npm run build`
2. Serve with: `npm start`
3. Configure reverse proxy for production

### Environment-Specific Configuration

Create different `.env` files for different environments:
- `.env.local` - Local development
- `.env.production` - Production
- `.env.staging` - Staging

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## Support

If you encounter issues:
1. Check the [Issues](https://github.com/foozio/nh-markaz/issues) page
2. Create a new issue with detailed information
3. Include your environment and error messages