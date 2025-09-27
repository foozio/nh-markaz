'use server';

export interface HadithCollectionSummary {
  id: string;
  name: string;
  available: number;
}

export interface HadithEntry {
  number: number;
  arab: string;
  id: string;
}

export interface HadithCollectionDetail extends HadithCollectionSummary {
  requested: number;
  hadiths: HadithEntry[];
}

const API_BASE_URL = 'https://api.hadith.gading.dev';
const MAX_RANGE_SIZE = 300;
const RATE_LIMIT_DELAY_MS = 150;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  error: boolean;
};

async function fetchFromApi<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    throw new Error(`Hadith API request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (payload.error || payload.code !== 200) {
    throw new Error(payload.message || 'Hadith API returned an error');
  }

  return payload.data;
}

export async function getHadithCollections(): Promise<HadithCollectionSummary[]> {
  return fetchFromApi<HadithCollectionSummary[]>('/books');
}

export async function getHadiths(
  collectionId: string,
  range = '1-10',
): Promise<HadithCollectionDetail> {
  if (!collectionId) {
    throw new Error('collectionId is required');
  }

  const searchParams = new URLSearchParams();
  searchParams.set('range', range);

  return fetchFromApi<HadithCollectionDetail>(`/books/${collectionId}?${searchParams.toString()}`);
}

export async function getSingleHadith(collectionId: string, number: number): Promise<HadithEntry> {
  const detail = await getHadiths(collectionId, `${number}-${number}`);
  // When a single number is requested, API still wraps data.hadiths array with length 1
  return detail.hadiths[0];
}

export async function getCompleteHadithCollection(
  collectionId: string,
  totalAvailable?: number,
): Promise<HadithCollectionDetail> {
  if (!collectionId) {
    throw new Error('collectionId is required');
  }

  const targetTotal = totalAvailable && totalAvailable > 0 ? totalAvailable : null;
  const initialEnd = targetTotal ? Math.min(targetTotal, MAX_RANGE_SIZE) : MAX_RANGE_SIZE;
  const initialRangeEnd = Math.max(initialEnd, 1);
  const initialDetail = await getHadiths(collectionId, `1-${initialRangeEnd}`);

  const available = initialDetail.available;
  const effectiveTotal = targetTotal ? Math.min(targetTotal, available) : available;
  const aggregatedHadiths: HadithEntry[] = [...initialDetail.hadiths];

  let fetchedUntil = aggregatedHadiths.length;

  while (fetchedUntil < effectiveTotal) {
    const start = fetchedUntil + 1;
    const end = Math.min(start + MAX_RANGE_SIZE - 1, effectiveTotal);
    await delay(RATE_LIMIT_DELAY_MS);
    const chunk = await getHadiths(collectionId, `${start}-${end}`);
    aggregatedHadiths.push(...chunk.hadiths);
    fetchedUntil = aggregatedHadiths.length;
  }

  return {
    ...initialDetail,
    requested: aggregatedHadiths.length,
    hadiths: aggregatedHadiths,
  };
}

export interface HadithSearchResult {
  collectionId: string;
  hadithNumber: number;
  arabicText: string;
  translation: string;
  narrator: string;
  grade: string;
}

export async function searchHadith(query: string): Promise<HadithSearchResult[]> {
  try {
    // First, try to search in local database/cache (currently empty)
    // In the future, this would check a local SQLite database
    let localResults: HadithSearchResult[] = [];
    
    // If no local results, fallback to external API search
    if (localResults.length === 0) {
      console.log('No local hadith results found, searching external API...');
      return await searchHadithExternal(query);
    }
    
    return localResults;
  } catch (error) {
    console.error('Hadith search error:', error);
    // If all else fails, return empty array
    return [];
  }
}

// External API search function for Hadith
export async function searchHadithExternal(query: string): Promise<HadithSearchResult[]> {
  try {
    // Get available collections first
    const collections = await getHadithCollections();
    const results: HadithSearchResult[] = [];
    
    // Search through major collections (limit to avoid too many API calls)
    const majorCollections = collections.slice(0, 3); // Bukhari, Muslim, etc.
    
    for (const collection of majorCollections) {
      try {
        // Get a sample of hadiths from each collection to search through
        const hadithData = await getHadiths(collection.id, '1-50');
        
        // Simple text search in Arabic text
        const matches = hadithData.hadiths.filter(hadith => 
          hadith.arab.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(hadith.arab.toLowerCase())
        );
        
        // Transform matches to our result format
        const collectionResults: HadithSearchResult[] = matches.map(hadith => ({
          collectionId: collection.id,
          hadithNumber: hadith.number,
          arabicText: hadith.arab,
          translation: '', // API doesn't provide translation in this endpoint
          narrator: '', // Would need additional API call for full details
          grade: 'Sahih', // Default grade, would need proper grading data
          source: 'external' as const
        }));
        
        results.push(...collectionResults);
        
        // Add delay to respect rate limits
        await delay(RATE_LIMIT_DELAY_MS);
        
        // Limit total results
        if (results.length >= 20) break;
      } catch (collectionError) {
        console.error(`Error searching collection ${collection.id}:`, collectionError);
        continue;
      }
    }
    
    return results.slice(0, 20); // Limit final results
  } catch (error) {
    console.error('External Hadith search error:', error);
    return [];
  }
}
