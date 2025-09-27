
'use server';

import type { Surah, SurahSummary } from './quran-data';

const API_BASE_URL = 'https://api.quran.gading.dev';

// Cache to store fetched data
const cache = new Map<string, any>();

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  if (cache.has(endpoint)) {
    return cache.get(endpoint);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.code !== 200) {
        throw new Error(data.message || 'API returned an error');
    }

    cache.set(endpoint, data.data);
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

export async function getSurahs(): Promise<SurahSummary[]> {
  return fetchFromApi<SurahSummary[]>('/surah');
}

export async function getSurah(surahNumber: number): Promise<Surah> {
    const surahData = await fetchFromApi<Surah>(`/surah/${surahNumber}`);
    return surahData;
}

export interface QuranSearchResult {
  surahNumber: number;
  verseNumber: number;
  arabicText: string;
  translation: string;
  surahName: string;
}

export async function searchQuran(query: string): Promise<QuranSearchResult[]> {
  try {
    // First, try to search in local database/cache (currently empty)
    // In the future, this would check a local SQLite database
    let localResults: QuranSearchResult[] = [];
    
    // If no local results, fallback to external API search
    if (localResults.length === 0) {
      console.log('No local results found, searching external API...');
      return await searchQuranExternal(query);
    }
    
    return localResults;
  } catch (error) {
    console.error('Search error:', error);
    // If all else fails, return empty array
    return [];
  }
}

// External API search function
export async function searchQuranExternal(query: string): Promise<QuranSearchResult[]> {
  try {
    // Use Al-Quran Cloud API for search
    const searchUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/id.indonesian`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data?.matches) {
      return [];
    }
    
    // Transform API results to our format
    const results: QuranSearchResult[] = data.data.matches.map((match: any) => ({
      surahNumber: match.surah.number,
      verseNumber: match.numberInSurah,
      arabicText: match.text,
      translation: match.translation?.text || '',
      surahName: match.surah.englishName,
      source: 'external' as const
    }));
    
    // Limit results to prevent overwhelming UI
    return results.slice(0, 50);
  } catch (error) {
    console.error('External Quran search error:', error);
    return [];
  }
}
