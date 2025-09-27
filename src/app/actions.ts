'use server';

import { summarizeVerse, type SummarizeVerseInput } from '@/ai/flows/ai-summarize-verse';
import { summarizeHadith, type SummarizeHadithInput } from '@/ai/flows/ai-summarize-hadith';
import { loadNotes, saveNotes, loadHadithNotes, saveHadithNotes } from '@/lib/firestore';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Anda harus masuk untuk mengakses catatan.');
  }

  return user.id;
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
  return loadNotes(userId);
}

export async function saveUserNotes(notes: string) {
  const userId = await getAuthenticatedUserId();
  return saveNotes(userId, notes);
}

export async function loadUserHadithNotes(collectionId: string) {
  const userId = await getAuthenticatedUserId();
  return loadHadithNotes(userId, collectionId);
}

export async function saveUserHadithNotes(collectionId: string, notes: string) {
  const userId = await getAuthenticatedUserId();
  return saveHadithNotes(userId, collectionId, notes);
}
