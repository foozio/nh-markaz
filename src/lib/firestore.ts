'use server';

// Temporary in-memory storage to avoid sqlite3 compilation issues
const notesStorage = new Map<string, string>();
const hadithNotesStorage = new Map<string, string>();

async function saveNotes(userId: string, notes: string) {
  try {
    notesStorage.set(userId, notes);
    return { success: true };
  } catch (error) {
    console.error('Error saving notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

async function loadNotes(userId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const notes = notesStorage.get(userId) || '';
    return { notes };
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
    const key = `${userId}:${collectionId}`;
    hadithNotesStorage.set(key, notes);
    return { success: true };
  } catch (error) {
    console.error('Error saving hadith notes: ', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { success: false, error: errorMessage };
  }
}

async function loadHadithNotes(userId: string, collectionId: string): Promise<{ notes?: string; error?: string }> {
  try {
    const key = `${userId}:${collectionId}`;
    const notes = hadithNotesStorage.get(key) || '';
    return { notes };
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
