# Database Documentation

## Overview

Markaz uses a hybrid database approach combining Supabase PostgreSQL for user data and SQLite for local caching of Quran and Hadith content.

## Database Architecture

### Supabase PostgreSQL (User Data)

**Purpose:** Store user-specific data that requires persistence and synchronization across devices.

**Tables:**
- `user_notes` - User notes and bookmarks

### SQLite (Local Caching)

**Purpose:** Cache external API data for improved performance and offline functionality.

**Databases:**
- `data/cache.db` - Quran and Hadith content cache
- `data/notes.db` - Local user notes (fallback)

## Supabase Schema

### user_notes Table

```sql
CREATE TABLE user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL CHECK (note_type IN ('quran', 'hadith')),
  collection_id TEXT, -- NULL for Quran notes, collection ID for Hadith
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id` - Primary key (UUID)
- `user_id` - Reference to Supabase auth user
- `note_type` - Either 'quran' or 'hadith'
- `collection_id` - Hadith collection ID (NULL for Quran notes)
- `notes` - Rich text content in HTML format
- `created_at` - Record creation timestamp
- `updated_at` - Last update timestamp

**Constraints:**
- Unique constraint on `(user_id, note_type)` for Quran notes
- Unique constraint on `(user_id, note_type, collection_id)` for Hadith notes

## Migrations

### Migration 001: Add Unique Constraints

**File:** `supabase/migrations/001_add_unique_constraints.sql`

```sql
-- Create a unique index for Quran notes (user_id, note_type) where collection_id is NULL
CREATE UNIQUE INDEX unique_user_quran_notes_idx
ON user_notes (user_id, note_type)
WHERE note_type = 'quran' AND collection_id IS NULL;

-- Create a unique index for Hadith notes (user_id, note_type, collection_id) where collection_id is NOT NULL
CREATE UNIQUE INDEX unique_user_hadith_notes_idx
ON user_notes (user_id, note_type, collection_id)
WHERE note_type = 'hadith' AND collection_id IS NOT NULL;
```

**Purpose:** Ensure users can only have one note per Quran and one note per Hadith collection.

### Migration 002: Add Unique Constraints (Alternative)

**File:** `supabase/migrations/002_add_unique_constraints_user_notes.sql`

```sql
-- Add unique constraint for Quran notes (user_id + note_type)
ALTER TABLE user_notes
ADD CONSTRAINT unique_user_quran_notes
UNIQUE (user_id, note_type)
WHERE note_type = 'quran';

-- Add unique constraint for Hadith notes (user_id + note_type + collection_id)
ALTER TABLE user_notes
ADD CONSTRAINT unique_user_hadith_notes
UNIQUE (user_id, note_type, collection_id)
WHERE note_type = 'hadith' AND collection_id IS NOT NULL;
```

**Purpose:** Alternative approach using table constraints instead of indexes.

## Data Access Patterns

### User Notes

#### Reading Notes

```typescript
// Get Quran notes for user
const { data: quranNotes } = await supabase
  .from('user_notes')
  .select('*')
  .eq('user_id', userId)
  .eq('note_type', 'quran')
  .single();

// Get Hadith notes for user and collection
const { data: hadithNotes } = await supabase
  .from('user_notes')
  .select('*')
  .eq('user_id', userId)
  .eq('note_type', 'hadith')
  .eq('collection_id', collectionId)
  .single();
```

#### Writing Notes (Upsert)

```typescript
// Insert or update Quran notes
const { data, error } = await supabase
  .from('user_notes')
  .upsert({
    user_id: userId,
    note_type: 'quran',
    notes: noteContent,
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'user_id,note_type'
  });

// Insert or update Hadith notes
const { data, error } = await supabase
  .from('user_notes')
  .upsert({
    user_id: userId,
    note_type: 'hadith',
    collection_id: collectionId,
    notes: noteContent,
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'user_id,note_type,collection_id'
  });
```

## SQLite Caching Strategy

### Cache Structure

The SQLite cache stores frequently accessed data to reduce API calls:

```sql
-- Quran cache table structure
CREATE TABLE quran_cache (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  expires_at INTEGER
);

-- Hadith cache table structure
CREATE TABLE hadith_cache (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  expires_at INTEGER
);
```

### Cache Keys

- Quran surahs: `surahs`
- Individual surah: `surah:{number}`
- Hadith collections: `hadith:collections`
- Hadith collection: `hadith:collection:{id}:{range}`

### Cache Expiration

- Quran data: 24 hours
- Hadith data: 24 hours
- Search results: 1 hour

## Data Synchronization

### Client-Server Sync

1. **Local First:** Check local cache first
2. **Server Fallback:** Fetch from API if cache miss or expired
3. **Background Refresh:** Update cache asynchronously
4. **Conflict Resolution:** Server data takes precedence

### Offline Support

- **Read Operations:** Serve from cache when offline
- **Write Operations:** Queue for later sync
- **Sync on Reconnect:** Automatically sync pending changes

## Security Considerations

### Row Level Security (RLS)

Supabase RLS policies ensure users can only access their own data:

```sql
-- Enable RLS
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Policy for users to access only their own notes
CREATE POLICY "Users can access own notes" ON user_notes
  FOR ALL USING (auth.uid() = user_id);
```

### Data Encryption

- All data transmitted over HTTPS
- Sensitive data encrypted at rest in Supabase
- API keys stored as environment variables

## Performance Optimization

### Indexing Strategy

```sql
-- Composite index for common queries
CREATE INDEX idx_user_notes_user_type ON user_notes (user_id, note_type);

-- Index for Hadith collection queries
CREATE INDEX idx_user_notes_collection ON user_notes (user_id, note_type, collection_id);
```

### Query Optimization

- Use `SELECT` with specific columns
- Implement pagination for large result sets
- Cache frequently accessed data
- Use database indexes effectively

## Backup and Recovery

### Supabase Backups

- Automatic daily backups
- Point-in-time recovery available
- Data export capabilities

### Local Cache

- SQLite databases are not critical (can be rebuilt)
- Cache data can be cleared without data loss
- Automatic recreation on next API call

## Monitoring and Maintenance

### Database Monitoring

- Supabase provides built-in monitoring
- Query performance tracking
- Storage usage alerts

### Maintenance Tasks

- Regular cache cleanup
- Index optimization
- Migration testing
- Backup verification

## Migration Guide

When adding new database changes:

1. Create migration file in `supabase/migrations/`
2. Test migration on development database
3. Update TypeScript types in `supabase.ts`
4. Update data access functions
5. Test with real data
6. Deploy to staging, then production