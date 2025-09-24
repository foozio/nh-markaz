
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

async function getUrduTranslation(surahNumber: number): Promise<Record<number, string>> {
    try {
        // Unfortunately, quran.gading.dev doesn't directly support Urdu in the same way.
        // We'll use a different source for Urdu translations. This one is from Tanzil.
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/urd-muhammadjunagar-la/${surahNumber}.json`);
        if (!response.ok) {
            console.warn(`Could not fetch Urdu translation for surah ${surahNumber}`);
            return {};
        }
        const data = await response.json();
        const urduTranslations: Record<number, string> = {};
        if (data.chapter) {
             data.chapter.forEach((v: {verse: number, text: string}) => {
                urduTranslations[v.verse] = v.text;
             });
        }
        return urduTranslations;
    } catch (error) {
        console.warn(`Error fetching Urdu translation for surah ${surahNumber}:`, error);
        return {};
    }
}


export async function getSurah(surahNumber: number): Promise<Surah> {
    const surahData = await fetchFromApi<Surah>(`/surah/${surahNumber}`);
    const urduTranslations = await getUrduTranslation(surahNumber);
    
    // Add urdu translation to each verse
    if (surahData && surahData.verses) {
        surahData.verses = surahData.verses.map(verse => {
            return {
                ...verse,
                translation: {
                    ...verse.translation,
                    ur: urduTranslations[verse.number.inSurah] || "Translation not available"
                }
            };
        });
    }

    return surahData;
}
