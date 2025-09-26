'use server';

import { summarizeVerse, type SummarizeVerseInput } from '@/ai/flows/ai-summarize-verse';
import { summarizeHadith, type SummarizeHadithInput } from '@/ai/flows/ai-summarize-hadith';
import { getUserNote, saveUserNote, type UserNote } from '@/lib/database';
import { getServerAuthSession } from '@/lib/auth';

async function getAuthenticatedUserId() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    throw new Error('Anda harus masuk untuk mengakses catatan.');
  }

  const identifier = session.user.email || session.user.id;
  if (!identifier) {
    throw new Error('Profil pengguna tidak memiliki identitas unik.');
  }

  return identifier;
}

export async function getVerseSummary(verseText: string) {
  try {
    const input: SummarizeVerseInput = { verseText };
    const result = await summarizeVerse(input);
    return { summary: result.summary, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { summary: null, error: `Gagal menghasilkan ringkasan: ${errorMessage}` };
  }
}

export async function getHadithSummary(hadithText: string) {
  try {
    const input: SummarizeHadithInput = { hadithText };
    const result = await summarizeHadith(input);
    return { summary: result.summary, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { summary: null, error: `Gagal menghasilkan ringkasan hadith: ${errorMessage}` };
  }
}

export async function loadUserNotes() {
  const userId = await getAuthenticatedUserId();
  return getUserNote(userId, 'quran');
}

export async function saveUserNotes(notes: string) {
  const userId = await getAuthenticatedUserId();
  const note: UserNote = {
    userId,
    noteType: 'quran',
    content: notes
  };
  return saveUserNote(note);
}

export async function loadUserHadithNotes(collectionId: string) {
  const userId = await getAuthenticatedUserId();
  return getUserNote(userId, 'hadith', collectionId);
}

export async function saveUserHadithNotes(collectionId: string, notes: string) {
  const userId = await getAuthenticatedUserId();
  const note: UserNote = {
    userId,
    noteType: 'hadith',
    content: notes,
    collectionId
  };
  return saveUserNote(note);
}
