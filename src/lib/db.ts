import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'markaz.db');

function ensureDbFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let db: Database.Database | null = null;

export function getDb() {
  if (db) return db;
  ensureDbFile();
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  migrate(db);
  return db;
}

function migrate(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_notes (
      user_id TEXT PRIMARY KEY,
      content TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS user_hadith_notes (
      user_id TEXT NOT NULL,
      collection_id TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      PRIMARY KEY (user_id, collection_id)
    );

    CREATE TABLE IF NOT EXISTS quran_bookmarks (
      user_id TEXT NOT NULL,
      surah_number INTEGER NOT NULL,
      verse_number INTEGER NOT NULL,
      surah_name TEXT NOT NULL,
      verse_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, surah_number, verse_number)
    );

    CREATE TABLE IF NOT EXISTS hadith_bookmarks (
      user_id TEXT NOT NULL,
      collection_id TEXT NOT NULL,
      collection_name TEXT NOT NULL,
      number INTEGER NOT NULL,
      excerpt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, collection_id, number)
    );
  `);
}
