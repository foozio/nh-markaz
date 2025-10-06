# Architecture Overview

## Overview

Markaz is a Next.js-based Quran and Hadith study application built with TypeScript, featuring AI-powered insights, personal note-taking, and comprehensive search functionality.

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom design system
- **Radix UI** - Accessible component primitives
- **TipTap** - Rich text editor for notes

### Backend & APIs
- **Next.js API Routes** - Server-side API endpoints
- **Supabase** - Authentication and database
- **Firebase Genkit** - AI integration with Google Gemini
- **External APIs**:
  - Quran API (api.quran.gading.dev)
  - Hadith API (api.hadith.gading.dev)
  - Al-Quran Cloud API (for search)

### Database & Storage
- **Supabase PostgreSQL** - User data and notes
- **SQLite** - Local caching for Quran/Hadith data
- **Local Storage** - Client-side bookmarks

## Application Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── quran/             # Quran browsing pages
│   ├── hadith/            # Hadith browsing pages
│   ├── search/            # Search functionality
│   └── login/             # Authentication
├── components/            # React components
│   ├── quran/            # Quran-specific components
│   ├── hadith/           # Hadith-specific components
│   ├── search/           # Search components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── quran-api.ts      # Quran data fetching
│   ├── hadith-api.ts     # Hadith data fetching
│   ├── supabase.ts       # Database client
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
├── ai/                   # AI integration
│   ├── flows/           # AI workflows
│   └── genkit.ts        # AI client setup
└── types/               # TypeScript definitions
```

## Key Features

### Quran Browser
- **Surah Navigation**: Browse all 114 surahs with Indonesian translation
- **Verse Interaction**: Bookmark verses, add to notes, generate AI summaries
- **Rich Text Notes**: Personal note-taking with rich text editor
- **Responsive Design**: Optimized for desktop and mobile

### Hadith Explorer
- **Collection Browser**: Access curated hadith collections (Bukhari, Muslim, etc.)
- **Pagination**: Efficient loading of large collections
- **Bookmarking**: Save important hadith for quick reference
- **AI Summaries**: Generate concise explanations of hadith

### Advanced Search
- **Multi-source Search**: Search Quran and Hadith simultaneously
- **Arabic & Translation**: Search in Arabic text and Indonesian translation
- **Intelligent Matching**: Fuzzy search with highlights
- **Result Navigation**: Direct links to verses/hadith

### Authentication & Personalization
- **Google OAuth**: Secure authentication via Supabase
- **Personal Notes**: User-specific note storage
- **Bookmarks**: Persistent bookmarking across sessions
- **Data Privacy**: All user data encrypted and secure

### AI Integration
- **Verse Summaries**: AI-generated explanations of Quran verses
- **Hadith Summaries**: Concise hadith interpretations
- **Contextual Insights**: Deeper understanding through AI analysis
- **Indonesian Language**: All AI responses in Bahasa Indonesia

## Data Flow

### Quran Data Flow
1. **API Fetching**: Data fetched from external Quran APIs
2. **Caching**: SQLite cache for performance optimization
3. **Client Rendering**: React components display verses with interactions
4. **User Actions**: Bookmarks and notes saved to Supabase
5. **AI Processing**: Optional AI summaries generated on-demand

### Hadith Data Flow
1. **Collection Loading**: Hadith collections fetched from API
2. **Pagination**: Large collections loaded in chunks
3. **Search Integration**: Search across multiple collections
4. **Personal Storage**: User notes and bookmarks in Supabase
5. **AI Enhancement**: Optional AI-powered summaries

## Security Considerations

- **Authentication**: Secure Google OAuth implementation
- **Data Encryption**: All user data encrypted at rest
- **API Security**: Server-side validation and rate limiting
- **Environment Variables**: Sensitive keys properly secured
- **Input Validation**: Comprehensive input sanitization

## Performance Optimizations

- **Caching Strategy**: Multi-layer caching (API, SQLite, browser)
- **Lazy Loading**: Components and data loaded on-demand
- **Pagination**: Large datasets paginated for smooth UX
- **Code Splitting**: Optimized bundle sizes with Next.js
- **Image Optimization**: Next.js Image component for assets

## Deployment

- **Vercel**: Recommended deployment platform
- **Environment Config**: Proper environment variable management
- **Database Migrations**: Automated Supabase migrations
- **CI/CD**: Automated testing and deployment pipelines