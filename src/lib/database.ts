import Database from 'better-sqlite3';
import path from 'path';

// Database path
const DB_PATH = path.join(process.cwd(), 'data', 'cache.db');

// Initialize database
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(DB_PATH);
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    
    // Initialize tables
    initializeTables(db);
  }
  return db;
}

function initializeTables(database: Database.Database) {
  // Quran cache table
  database.exec(`
    CREATE TABLE IF NOT EXISTS quran_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      surah_id INTEGER NOT NULL,
      ayah_number INTEGER NOT NULL,
      arabic_text TEXT NOT NULL,
      translation_id TEXT NOT NULL,
      translation_text TEXT NOT NULL,
      transliteration TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(surah_id, ayah_number, translation_id)
    )
  `);
  
  // Hadith cache table
  database.exec(`
    CREATE TABLE IF NOT EXISTS hadith_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id TEXT NOT NULL,
      hadith_number INTEGER NOT NULL,
      arabic_text TEXT NOT NULL,
      translation_text TEXT NOT NULL,
      narrator TEXT,
      grade TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(collection_id, hadith_number)
    )
  `);
  
  // Search cache table for faster search results
  database.exec(`
    CREATE TABLE IF NOT EXISTS search_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      search_query TEXT NOT NULL,
      search_type TEXT NOT NULL, -- 'quran' or 'hadith'
      results_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      UNIQUE(search_query, search_type)
    )
  `);
  
  // User notes table
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      note_type TEXT NOT NULL, -- 'quran' or 'hadith'
      content TEXT NOT NULL,
      collection_id TEXT, -- for hadith notes
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, note_type, collection_id)
    )
  `);

  // Create indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_quran_surah_ayah ON quran_cache(surah_id, ayah_number);
    CREATE INDEX IF NOT EXISTS idx_hadith_collection ON hadith_cache(collection_id, hadith_number);
    CREATE INDEX IF NOT EXISTS idx_search_query ON search_cache(search_query, search_type);
    CREATE INDEX IF NOT EXISTS idx_search_expires ON search_cache(expires_at);
    CREATE INDEX IF NOT EXISTS idx_user_notes ON user_notes(user_id, note_type);
  `);
}

// Quran cache operations
export interface QuranVerse {
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  translationId: string;
  translationText: string;
  transliteration?: string;
}

export function cacheQuranVerse(verse: QuranVerse): void {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO quran_cache 
    (surah_id, ayah_number, arabic_text, translation_id, translation_text, transliteration, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  stmt.run(
    verse.surahId,
    verse.ayahNumber,
    verse.arabicText,
    verse.translationId,
    verse.translationText,
    verse.transliteration || null
  );
}

export function getCachedQuranVerse(surahId: number, ayahNumber: number, translationId: string): QuranVerse | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM quran_cache 
    WHERE surah_id = ? AND ayah_number = ? AND translation_id = ?
  `);
  
  const row = stmt.get(surahId, ayahNumber, translationId) as any;
  if (!row) return null;
  
  return {
    surahId: row.surah_id,
    ayahNumber: row.ayah_number,
    arabicText: row.arabic_text,
    translationId: row.translation_id,
    translationText: row.translation_text,
    transliteration: row.transliteration
  };
}

// Hadith cache operations
export interface HadithData {
  collectionId: string;
  hadithNumber: number;
  arabicText: string;
  translationText: string;
  narrator?: string;
  grade?: string;
}

export function cacheHadith(hadith: HadithData): void {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO hadith_cache 
    (collection_id, hadith_number, arabic_text, translation_text, narrator, grade, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  stmt.run(
    hadith.collectionId,
    hadith.hadithNumber,
    hadith.arabicText,
    hadith.translationText,
    hadith.narrator || null,
    hadith.grade || null
  );
}

export function getCachedHadith(collectionId: string, hadithNumber: number): HadithData | null {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM hadith_cache 
    WHERE collection_id = ? AND hadith_number = ?
  `);
  
  const row = stmt.get(collectionId, hadithNumber) as any;
  if (!row) return null;
  
  return {
    collectionId: row.collection_id,
    hadithNumber: row.hadith_number,
    arabicText: row.arabic_text,
    translationText: row.translation_text,
    narrator: row.narrator,
    grade: row.grade
  };
}

// Search cache operations
export function cacheSearchResults(query: string, type: 'quran' | 'hadith', results: any[], ttlHours: number = 24): void {
  const database = getDatabase();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO search_cache 
    (search_query, search_type, results_json, expires_at)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(query.toLowerCase(), type, JSON.stringify(results), expiresAt);
}

export function getCachedSearchResults(query: string, type: 'quran' | 'hadith'): any[] | null {
  const database = getDatabase();
  
  // Clean expired cache first
  cleanExpiredSearchCache();
  
  const stmt = database.prepare(`
    SELECT results_json FROM search_cache 
    WHERE search_query = ? AND search_type = ? AND expires_at > CURRENT_TIMESTAMP
  `);
  
  const row = stmt.get(query.toLowerCase(), type) as any;
  if (!row) return null;
  
  try {
    return JSON.parse(row.results_json);
  } catch {
    return null;
  }
}

// Cache maintenance
export function cleanExpiredSearchCache(): void {
  const database = getDatabase();
  const stmt = database.prepare(`
    DELETE FROM search_cache WHERE expires_at <= CURRENT_TIMESTAMP
  `);
  stmt.run();
}

export function getCacheStats(): { quranCount: number; hadithCount: number; searchCount: number } {
  const database = getDatabase();
  
  const quranCount = database.prepare('SELECT COUNT(*) as count FROM quran_cache').get() as any;
  const hadithCount = database.prepare('SELECT COUNT(*) as count FROM hadith_cache').get() as any;
  const searchCount = database.prepare('SELECT COUNT(*) as count FROM search_cache WHERE expires_at > CURRENT_TIMESTAMP').get() as any;
  
  return {
    quranCount: quranCount.count,
    hadithCount: hadithCount.count,
    searchCount: searchCount.count
  };
}

// Close database connection
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// User notes operations
export interface UserNote {
  id?: number;
  userId: string;
  noteType: 'quran' | 'hadith';
  content: string;
  collectionId?: string; // for hadith notes
  createdAt?: string;
  updatedAt?: string;
}

export function saveUserNote(note: UserNote): { success: boolean; error?: string } {
  try {
    const database = getDatabase();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO user_notes 
      (user_id, note_type, content, collection_id, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    stmt.run(
      note.userId,
      note.noteType,
      note.content,
      note.collectionId || null
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error saving user note:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

export function getUserNote(userId: string, noteType: 'quran' | 'hadith', collectionId?: string): { notes?: string; error?: string } {
  try {
    const database = getDatabase();
    const stmt = database.prepare(`
      SELECT content FROM user_notes 
      WHERE user_id = ? AND note_type = ? AND (collection_id = ? OR (collection_id IS NULL AND ? IS NULL))
    `);
    
    const row = stmt.get(userId, noteType, collectionId || null, collectionId || null) as any;
    const notes = row ? row.content : '';
    
    return { notes };
  } catch (error) {
    console.error('Error loading user note:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export function getAllUserNotes(userId: string): UserNote[] {
  try {
    const database = getDatabase();
    const stmt = database.prepare(`
      SELECT * FROM user_notes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `);
    
    const rows = stmt.all(userId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      noteType: row.note_type,
      content: row.content,
      collectionId: row.collection_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error loading user notes:', error);
    return [];
  }
}

export function deleteUserNote(userId: string, noteType: 'quran' | 'hadith', collectionId?: string): { success: boolean; error?: string } {
  try {
    const database = getDatabase();
    const stmt = database.prepare(`
      DELETE FROM user_notes 
      WHERE user_id = ? AND note_type = ? AND (collection_id = ? OR (collection_id IS NULL AND ? IS NULL))
    `);
    
    stmt.run(userId, noteType, collectionId || null, collectionId || null);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user note:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

// Initialize database on module load
if (typeof window === 'undefined') {
  // Only initialize on server side
  getDatabase();
}