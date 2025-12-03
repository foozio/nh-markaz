'use server';

import { getDb } from './db';

export async function writeNotesForUser(userId: string, notes: string) {
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO user_notes (user_id, content) VALUES (@userId, @content)
      ON CONFLICT(user_id) DO UPDATE SET content=excluded.content
    `);
    stmt.run({ userId, content: notes });
    return { success: true };
  } catch (error) {
    console.error('Error saving notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

export async function readNotesForUser(userId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const db = getDb();
    const row = db.prepare('SELECT content FROM user_notes WHERE user_id = ?').get(userId) as { content?: string } | undefined;
    return { notes: row?.content ?? '' };
  } catch (error) {
    console.error('Error loading notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function writeHadithNotesForUser(userId: string, collectionId: string, notes: string) {
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO user_hadith_notes (user_id, collection_id, content) VALUES (@userId, @collectionId, @content)
      ON CONFLICT(user_id, collection_id) DO UPDATE SET content=excluded.content
    `);
    stmt.run({ userId, collectionId, content: notes });
    return { success: true };
  } catch (error) {
    console.error('Error saving hadith notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

export async function readHadithNotesForUser(userId: string, collectionId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const db = getDb();
    const row = db.prepare('SELECT content FROM user_hadith_notes WHERE user_id = ? AND collection_id = ?').get(userId, collectionId) as { content?: string } | undefined;
    return { notes: row?.content ?? '' };
  } catch (error) {
    console.error('Error loading hadith notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function listQuranBookmarks(userId: string) {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT surah_number, verse_number, surah_name, verse_text FROM quran_bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Array<{
      surah_number: number;
      verse_number: number;
      surah_name: string;
      verse_text: string;
    }>;
    return rows.map(row => ({
      surahNumber: row.surah_number,
      verseNumber: row.verse_number,
      surahName: row.surah_name,
      text: row.verse_text,
    }));
  } catch (error) {
    console.error('Error loading quran bookmarks: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function toggleQuranBookmark(userId: string, surahNumber: number, verseNumber: number, surahName: string, verseText: string) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT 1 FROM quran_bookmarks WHERE user_id = ? AND surah_number = ? AND verse_number = ?').get(userId, surahNumber, verseNumber);
    if (existing) {
      db.prepare('DELETE FROM quran_bookmarks WHERE user_id = ? AND surah_number = ? AND verse_number = ?').run(userId, surahNumber, verseNumber);
      return { success: true, removed: true };
    }
    db.prepare(`
      INSERT INTO quran_bookmarks (user_id, surah_number, verse_number, surah_name, verse_text)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, surahNumber, verseNumber, surahName, verseText);
    return { success: true, removed: false };
  } catch (error) {
    console.error('Error toggling quran bookmark: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

export async function listHadithBookmarks(userId: string) {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT collection_id, collection_name, number, excerpt FROM hadith_bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Array<{
      collection_id: string;
      collection_name: string;
      number: number;
      excerpt: string;
    }>;
    return rows.map(row => ({
      collectionId: row.collection_id,
      collectionName: row.collection_name,
      number: row.number,
      excerpt: row.excerpt,
    }));
  } catch (error) {
    console.error('Error loading hadith bookmarks: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function toggleHadithBookmark(userId: string, collectionId: string, collectionName: string, number: number, excerpt: string) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT 1 FROM hadith_bookmarks WHERE user_id = ? AND collection_id = ? AND number = ?').get(userId, collectionId, number);
    if (existing) {
      db.prepare('DELETE FROM hadith_bookmarks WHERE user_id = ? AND collection_id = ? AND number = ?').run(userId, collectionId, number);
      return { success: true, removed: true };
    }
    db.prepare(`
      INSERT INTO hadith_bookmarks (user_id, collection_id, collection_name, number, excerpt)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, collectionId, collectionName, number, excerpt);
    return { success: true, removed: false };
  } catch (error) {
    console.error('Error toggling hadith bookmark: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}
