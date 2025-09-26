'use server';

import { saveUserNote, getUserNote, type UserNote } from './database';

async function saveNotes(userId: string, notes: string) {
  const note: UserNote = {
    userId,
    noteType: 'quran',
    content: notes
  };
  
  return saveUserNote(note);
}

async function loadNotes(userId: string): Promise<{ notes?: string; error?: string }> {
  return getUserNote(userId, 'quran');
}

export async function writeNotesForUser(userId: string, notes: string) {
  return saveNotes(userId, notes);
}

export async function readNotesForUser(userId: string) {
  return loadNotes(userId);
}

async function saveHadithNotes(userId: string, collectionId: string, notes: string) {
  const note: UserNote = {
    userId,
    noteType: 'hadith',
    content: notes,
    collectionId
  };
  
  return saveUserNote(note);
}

async function loadHadithNotes(userId: string, collectionId: string): Promise<{ notes?: string; error?: string }> {
  return getUserNote(userId, 'hadith', collectionId);
}

export async function writeHadithNotesForUser(userId: string, collectionId: string, notes: string) {
  return saveHadithNotes(userId, collectionId, notes);
}

export async function readHadithNotesForUser(userId: string, collectionId: string) {
  return loadHadithNotes(userId, collectionId);
}
