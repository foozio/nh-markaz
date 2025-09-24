
'use server';

import { summarizeVerse, type SummarizeVerseInput } from '@/ai/flows/ai-summarize-verse';

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
