'use server';

import { summarizeVerse, type SummarizeVerseInput } from '@/ai/flows/ai-summarize-verse';
import { readNotesForUser, writeNotesForUser } from '@/lib/firestore';
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

export async function loadUserNotes() {
  const userId = await getAuthenticatedUserId();
  return readNotesForUser(userId);
}

export async function saveUserNotes(notes: string) {
  const userId = await getAuthenticatedUserId();
  return writeNotesForUser(userId, notes);
}
