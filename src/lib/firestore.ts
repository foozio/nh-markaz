'use server';

import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

const db = initDatabase();

function initDatabase() {
  sqlite3.verbose();

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'notes.db');
  const database = new sqlite3.Database(dbPath);

  database.serialize(() => {
    database.run(
      `CREATE TABLE IF NOT EXISTS userNotes (
        userId TEXT PRIMARY KEY,
        notes TEXT NOT NULL DEFAULT '',
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    );
    database.run(
      `CREATE TABLE IF NOT EXISTS userHadithNotes (
        userId TEXT NOT NULL,
        collectionId TEXT NOT NULL,
        notes TEXT NOT NULL DEFAULT '',
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (userId, collectionId)
      )`
    );
  });

  return database;
}

function run(sql: string, params: unknown[] = []) {
  return new Promise<void>((resolve, reject) => {
    db.run(sql, params, function runCallback(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function get<T = unknown>(sql: string, params: unknown[] = []) {
  return new Promise<T | undefined>((resolve, reject) => {
    db.get<T>(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ?? undefined);
      }
    });
  });
}

async function saveNotes(userId: string, notes: string) {
  try {
    await run(
      `INSERT INTO userNotes (userId, notes, updatedAt)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(userId) DO UPDATE SET
         notes = excluded.notes,
         updatedAt = CURRENT_TIMESTAMP`,
      [userId, notes]
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

async function loadNotes(userId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const row = await get<{ notes: string }>(
      'SELECT notes FROM userNotes WHERE userId = ?',
      [userId]
    );

    if (row) {
      return { notes: row.notes ?? '' };
    }

    return { notes: '' };
  } catch (error) {
    console.error('Error loading notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function writeNotesForUser(userId: string, notes: string) {
  return saveNotes(userId, notes);
}

export async function readNotesForUser(userId: string) {
  return loadNotes(userId);
}

async function saveHadithNotes(userId: string, collectionId: string, notes: string) {
  try {
    await run(
      `INSERT INTO userHadithNotes (userId, collectionId, notes, updatedAt)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(userId, collectionId) DO UPDATE SET
         notes = excluded.notes,
         updatedAt = CURRENT_TIMESTAMP`,
      [userId, collectionId, notes]
    );
    return { success: true };
  } catch (error) {
    console.error('Error saving hadith notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

async function loadHadithNotes(userId: string, collectionId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const row = await get<{ notes: string }>(
      'SELECT notes FROM userHadithNotes WHERE userId = ? AND collectionId = ?',
      [userId, collectionId]
    );

    if (row) {
      return { notes: row.notes ?? '' };
    }

    return { notes: '' };
  } catch (error) {
    console.error('Error loading hadith notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: errorMessage };
  }
}

export async function writeHadithNotesForUser(userId: string, collectionId: string, notes: string) {
  return saveHadithNotes(userId, collectionId, notes);
}

export async function readHadithNotesForUser(userId: string, collectionId: string) {
  return loadHadithNotes(userId, collectionId);
}
