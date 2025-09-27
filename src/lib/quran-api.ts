
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
  // This is a basic implementation - in a real app you'd want a proper search API
  // For now, we'll return an empty array as the search functionality would need
  // a dedicated search service or database
  // TODO: Implement actual search functionality
  return [];
}
