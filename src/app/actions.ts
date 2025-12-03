'use server';

import { summarizeVerse, type SummarizeVerseInput } from '@/ai/flows/ai-summarize-verse';
import { summarizeHadith, type SummarizeHadithInput } from '@/ai/flows/ai-summarize-hadith';
import {
  readNotesForUser,
  writeNotesForUser,
  readHadithNotesForUser,
  writeHadithNotesForUser,
  listQuranBookmarks,
  toggleQuranBookmark,
  listHadithBookmarks,
  toggleHadithBookmark,
} from '@/lib/firestore';
import { getServerAuthSession } from '@/lib/auth';
import { sanitizeHtml } from '@/lib/sanitize';
import { logError, logInfo, logWarn } from '@/lib/logging';

async function getAuthenticatedUserId() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    logWarn('auth.no_session', { reason: 'unauthenticated_action' });
    throw new Error('Anda harus masuk untuk mengakses catatan.');
  }

  const identifier = session.user.email || session.user.id;
  if (!identifier) {
    logError('auth.missing_identifier', new Error('missing identifier'), { sessionUser: session.user });
    throw new Error('Profil pengguna tidak memiliki identitas unik.');
  }

  return identifier;
}

export async function getVerseSummary(verseText: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { summary: null, error: 'Fitur AI dimatikan karena kunci GEMINI_API_KEY tidak tersedia.' };
    }
    const input: SummarizeVerseInput = { verseText };
    const result = await summarizeVerse(input);
    logInfo('ai.verse_summary.success', { length: verseText.length });
    return { summary: result.summary, error: null };
  } catch (e) {
    logError('ai.verse_summary.failed', e, { length: verseText.length });
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { summary: null, error: `Gagal menghasilkan ringkasan: ${errorMessage}` };
  }
}

export async function getHadithSummary(hadithText: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { summary: null, error: 'Fitur AI dimatikan karena kunci GEMINI_API_KEY tidak tersedia.' };
    }
    const input: SummarizeHadithInput = { hadithText };
    const result = await summarizeHadith(input);
    logInfo('ai.hadith_summary.success', { length: hadithText.length });
    return { summary: result.summary, error: null };
  } catch (e) {
    logError('ai.hadith_summary.failed', e, { length: hadithText.length });
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { summary: null, error: `Gagal menghasilkan ringkasan hadith: ${errorMessage}` };
  }
}

export async function loadUserNotes() {
  const userId = await getAuthenticatedUserId();
  const result = await readNotesForUser(userId);
  if (result.notes) {
    return { ...result, notes: sanitizeHtml(result.notes) };
  }
  return result;
}

export async function saveUserNotes(notes: string) {
  const userId = await getAuthenticatedUserId();
  const cleaned = sanitizeHtml(notes);
  return writeNotesForUser(userId, cleaned);
}

export async function loadUserHadithNotes(collectionId: string) {
  const userId = await getAuthenticatedUserId();
  const result = await readHadithNotesForUser(userId, collectionId);
  if (result.notes) {
    return { ...result, notes: sanitizeHtml(result.notes) };
  }
  return result;
}

export async function saveUserHadithNotes(collectionId: string, notes: string) {
  const userId = await getAuthenticatedUserId();
  const cleaned = sanitizeHtml(notes);
  return writeHadithNotesForUser(userId, collectionId, cleaned);
}

export async function loadQuranBookmarks() {
  const userId = await getAuthenticatedUserId();
  const bookmarks = await listQuranBookmarks(userId);
  if ('error' in bookmarks) {
    return bookmarks;
  }
  return { bookmarks };
}

export async function toggleQuranBookmarkForUser(surahNumber: number, verseNumber: number, surahName: string, verseText: string) {
  const userId = await getAuthenticatedUserId();
  return toggleQuranBookmark(userId, surahNumber, verseNumber, surahName, verseText);
}

export async function loadHadithBookmarks() {
  const userId = await getAuthenticatedUserId();
  const bookmarks = await listHadithBookmarks(userId);
  if ('error' in bookmarks) {
    return bookmarks;
  }
  return { bookmarks };
}

export async function toggleHadithBookmarkForUser(collectionId: string, collectionName: string, number: number, excerpt: string) {
  const userId = await getAuthenticatedUserId();
  return toggleHadithBookmark(userId, collectionId, collectionName, number, excerpt);
}
