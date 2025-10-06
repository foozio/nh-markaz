# AI Integration Documentation

## Overview

Markaz integrates Google Gemini AI through Firebase Genkit to provide intelligent summaries and insights for Quran verses and Hadith narrations.

## Architecture

### Tech Stack

- **Firebase Genkit** - AI workflow framework
- **Google Gemini 2.5 Flash** - AI model for text generation
- **TypeScript** - Type-safe AI interactions
- **Zod** - Schema validation for AI inputs/outputs

### AI Components

#### Genkit Configuration

**File:** `src/ai/genkit.ts`

```typescript
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```

#### AI Flows

Two main AI workflows are implemented:

1. **Verse Summarization** - Summarizes Quran verses
2. **Hadith Summarization** - Summarizes Hadith narrations

## Verse Summarization

### Flow Definition

**File:** `src/ai/flows/ai-summarize-verse.ts`

**Input Schema:**
```typescript
const SummarizeVerseInputSchema = z.object({
  verseText: z.string().describe('Teks terjemahan dari ayat Al-Quran yang akan diringkas.'),
});
```

**Output Schema:**
```typescript
const SummarizeVerseOutputSchema = z.object({
  summary: z.string().describe('Ringkasan singkat dari ayat Al-Quran dalam Bahasa Indonesia.'),
});
```

### AI Prompt

```
Anda adalah seorang mufassir Al-Quran AI. Tugas Anda adalah memberikan ringkasan tafsir yang singkat dan akurat dari ayat yang diberikan dalam Bahasa Indonesia, seolah-olah Anda sedang menjelaskan makna dan konteksnya kepada pembaca.

Ayat: {{{verseText}}}

Ringkasan Tafsir:
```

### Usage

```typescript
import { summarizeVerse } from '@/ai/flows/ai-summarize-verse';

const result = await summarizeVerse({
  verseText: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang."
});

console.log(result.summary); // "Ayat ini menekankan pentingnya menyebut nama Allah..."
```

## Hadith Summarization

### Flow Definition

**File:** `src/ai/flows/ai-summarize-hadith.ts`

**Input Schema:**
```typescript
const SummarizeHadithInputSchema = z.object({
  hadithText: z.string().describe('Narasi hadith beserta terjemahan Bahasa Indonesia yang akan diringkas.'),
});
```

**Output Schema:**
```typescript
const SummarizeHadithOutputSchema = z.object({
  summary: z.string().describe('Ringkasan singkat hadith dalam Bahasa Indonesia.'),
});
```

### AI Prompt

```
Anda adalah seorang ahli hadith AI. Tugas Anda adalah merangkum hadith berikut secara singkat dalam Bahasa Indonesia, menonjolkan inti ajaran dan pesan utamanya.

Hadith: {{{hadithText}}}

Ringkasan:
```

### Usage

```typescript
import { summarizeHadith } from '@/ai/flows/ai-summarize-hadith';

const result = await summarizeHadith({
  hadithText: "Rasulullah shallallahu 'alaihi wa sallam bersabda: 'Barang siapa yang beriman kepada Allah dan hari akhir...'"
});

console.log(result.summary); // "Hadith ini menekankan pentingnya iman kepada Allah..."
```

## Integration Points

### Quran Browser

**File:** `src/components/quran/quran-browser.tsx`

AI summaries are triggered when users click the "Summarize" button on verses:

```typescript
const handleAddSummaryToNotes = async (summary: string, verse: Ayah) => {
  // Generate AI summary
  const aiSummary = await summarizeVerse({ verseText: verse.translation.id });

  // Add to notes
  const summaryReference = `<h3>Ringkasan AI untuk Surah ${selectedSurah?.name.transliteration.en} (${selectedSurah?.number}:${verse.number.inSurah})</h3>`;
  const summaryText = `<p>${aiSummary.summary}</p><p></p>`;
  const noteText = `${summaryReference}${summaryText}`;

  setNotes(prevNotes => prevNotes ? `${prevNotes}${noteText}` : noteText);
};
```

### Hadith Reader

**File:** `src/components/hadith/hadith-reader.tsx`

AI summaries for hadith work similarly:

```typescript
const addSummarySnippet = async (summary: string, hadith: HadithEntry) => {
  // Generate AI summary
  const aiSummary = await summarizeHadith({ hadithText: hadith.id });

  // Add to notes
  const header = `<h3>Ringkasan AI - ${collectionName} Hadith #${hadith.number}</h3>`;
  const snippet = `${header}<p>${aiSummary.summary}</p><p></p>`;
  setNotes(prev => (prev ? `${prev}${snippet}` : snippet));
};
```

## Configuration

### Environment Variables

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Model Selection

Currently using `gemini-2.5-flash` for:
- Fast response times
- Cost-effective
- Good quality for text summarization

### Rate Limiting

- AI calls are rate-limited to prevent abuse
- Client-side throttling implemented
- Error handling for API limits

## Error Handling

### AI Service Errors

```typescript
try {
  const result = await summarizeVerse({ verseText: text });
  return result.summary;
} catch (error) {
  console.error('AI summarization failed:', error);
  // Fallback to user notification
  toast({
    title: "AI Summary Unavailable",
    description: "Unable to generate AI summary at this time.",
    variant: "destructive"
  });
  return "Summary unavailable";
}
```

### Network Issues

- Automatic retry logic for transient failures
- Graceful degradation when AI is unavailable
- User feedback for service status

## Performance Considerations

### Caching Strategy

- AI-generated summaries are not cached (fresh each time)
- Consider implementing summary caching for frequently requested verses
- Balance between freshness and performance

### Response Time

- Gemini 2.5 Flash provides sub-second responses
- UI shows loading states during AI generation
- Asynchronous processing to avoid blocking UI

## Security and Privacy

### Data Handling

- User text is sent securely to Google AI
- No personal data included in AI requests
- HTTPS encryption for all AI API calls

### Content Filtering

- AI prompts designed to provide appropriate Islamic content
- Input validation to prevent misuse
- Output sanitization before display

## Development and Testing

### Local Development

```bash
# Start AI development server
npm run genkit:dev

# Watch mode for AI development
npm run genkit:watch
```

### Testing AI Flows

```typescript
// Test verse summarization
const testVerse = "Bismillahirrahmanirrahim";
const result = await summarizeVerse({ verseText: testVerse });
expect(result.summary).toContain("Allah");
```

### Prompt Engineering

- Prompts are carefully crafted for Indonesian context
- Tested with various verse types
- Iterative refinement based on output quality

## Future Enhancements

### Potential Improvements

1. **Multi-language Support** - Support for Arabic, English summaries
2. **Contextual Summaries** - Include surrounding verses for better context
3. **Personalized Summaries** - Adapt to user knowledge level
4. **Batch Processing** - Summarize multiple verses at once
5. **Advanced Models** - Upgrade to more capable models when available

### Model Evaluation

- Regular evaluation of summary quality
- User feedback integration
- A/B testing for prompt improvements

## Monitoring and Analytics

### Usage Tracking

- Track AI feature usage
- Monitor response times
- Error rate monitoring

### Cost Management

- Monitor API usage costs
- Implement usage limits if needed
- Optimize prompt length for cost efficiency

## Troubleshooting

### Common Issues

#### API Key Issues
**Symptom:** AI features not working
**Solution:** Verify `GEMINI_API_KEY` is set correctly

#### Rate Limiting
**Symptom:** AI requests failing
**Solution:** Implement exponential backoff retry logic

#### Quality Issues
**Symptom:** Poor summary quality
**Solution:** Refine prompts and test with more examples

### Debug Mode

Enable debug logging for AI interactions:

```typescript
// In development
console.log('AI Request:', input);
console.log('AI Response:', result);
```

## Contributing

When modifying AI features:

1. Test prompts thoroughly with various inputs
2. Ensure Indonesian language quality
3. Update documentation for any schema changes
4. Consider performance impact
5. Test error handling scenarios