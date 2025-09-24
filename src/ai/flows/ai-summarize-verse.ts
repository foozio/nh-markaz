// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Provides AI-powered summarization of Quran verses.
 *
 * - summarizeVerse - A function that generates a concise summary of a given Quran verse.
 * - SummarizeVerseInput - The input type for the summarizeVerse function.
 * - SummarizeVerseOutput - The return type for the summarizeVerse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVerseInputSchema = z.object({
  verseText: z.string().describe('The text content of the Quran verse to be summarized.'),
});
export type SummarizeVerseInput = z.infer<typeof SummarizeVerseInputSchema>;

const SummarizeVerseOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the Quran verse.'),
});
export type SummarizeVerseOutput = z.infer<typeof SummarizeVerseOutputSchema>;

export async function summarizeVerse(input: SummarizeVerseInput): Promise<SummarizeVerseOutput> {
  return summarizeVerseFlow(input);
}

const summarizeVersePrompt = ai.definePrompt({
  name: 'summarizeVersePrompt',
  input: {schema: SummarizeVerseInputSchema},
  output: {schema: SummarizeVerseOutputSchema},
  prompt: `You are an AI expert on the Quran. Your task is to provide a concise and accurate summary of the given verse.

Verse: {{{verseText}}}

Summary:`, 
});

const summarizeVerseFlow = ai.defineFlow(
  {
    name: 'summarizeVerseFlow',
    inputSchema: SummarizeVerseInputSchema,
    outputSchema: SummarizeVerseOutputSchema,
  },
  async input => {
    const {output} = await summarizeVersePrompt(input);
    return output!;
  }
);
