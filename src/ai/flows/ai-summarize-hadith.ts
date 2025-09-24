// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides AI-powered summarization of hadith narrations.
 *
 * - summarizeHadith - A function that generates a concise summary of a given hadith.
 * - SummarizeHadithInput - The input type for the summarizeHadith function.
 * - SummarizeHadithOutput - The return type for the summarizeHadith function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHadithInputSchema = z.object({
  hadithText: z.string().describe('Narasi hadith beserta terjemahan Bahasa Indonesia yang akan diringkas.'),
});
export type SummarizeHadithInput = z.infer<typeof SummarizeHadithInputSchema>;

const SummarizeHadithOutputSchema = z.object({
  summary: z.string().describe('Ringkasan singkat hadith dalam Bahasa Indonesia.'),
});
export type SummarizeHadithOutput = z.infer<typeof SummarizeHadithOutputSchema>;

export async function summarizeHadith(input: SummarizeHadithInput): Promise<SummarizeHadithOutput> {
  return summarizeHadithFlow(input);
}

const summarizeHadithPrompt = ai.definePrompt({
  name: 'summarizeHadithPrompt',
  input: {schema: SummarizeHadithInputSchema},
  output: {schema: SummarizeHadithOutputSchema},
  prompt: `Anda adalah seorang ahli hadith AI. Tugas Anda adalah merangkum hadith berikut secara singkat dalam Bahasa Indonesia, menonjolkan inti ajaran dan pesan utamanya.

Hadith: {{{hadithText}}}

Ringkasan:`,
});

const summarizeHadithFlow = ai.defineFlow(
  {
    name: 'summarizeHadithFlow',
    inputSchema: SummarizeHadithInputSchema,
    outputSchema: SummarizeHadithOutputSchema,
  },
  async input => {
    const {output} = await summarizeHadithPrompt(input);
    return output!;
  }
);
