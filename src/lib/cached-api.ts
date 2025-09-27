import type { Surah, SurahSummary } from './quran-data';
import { Database } from 'better-sqlite3';
import { getCacheStats, getCachedSearchResults, cacheSearchResults, cacheQuranVerse, cacheHadith, getCachedHadith, getDatabase, QuranVerse, HadithData } from './database';
import { getSurahs, getSurah } from './quran-api';
import { getHadithCollections } from './hadith-api';

const API_BASE_URL_QURAN = 'https://api.quran.gading.dev';
const API_BASE_URL_HADITH = 'https://api.hadith.gading.dev';

// In-memory cache for collections and metadata (lighter data)
const memoryCache = new Map<string, any>();

// Additional type definitions for Hadith API
export interface HadithEntry {
  number: number;
  arab: string;
  id: string;
}

export interface HadithCollectionSummary {
  id: string;
  name: string;
  total: number;
}

export interface HadithCollectionDetail {
  id: string;
  name: string;
  total: number;
  hadiths: HadithEntry[];
}

// Generic API fetch function
async function fetchFromApi<T>(baseUrl: string, endpoint: string, init?: RequestInit): Promise<T> {
  const cacheKey = `${baseUrl}${endpoint}`;
  
  // Check memory cache first for metadata
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 * 60 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.code !== 200) {
      throw new Error(data.message || 'API returned an error');
    }

    // Cache metadata in memory
    memoryCache.set(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Quran API with caching
export async function getCachedSurahs(): Promise<SurahSummary[]> {
  return fetchFromApi<SurahSummary[]>(API_BASE_URL_QURAN, '/surah');
}

export async function getCachedSurah(surahNumber: number, useCache: boolean = true): Promise<Surah> {
  const cacheKey = `surah_${surahNumber}`;
  
  if (useCache && memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const surahData = await fetchFromApi<Surah>(API_BASE_URL_QURAN, `/surah/${surahNumber}`);
  
  // Cache individual verses in SQLite for search purposes
  if (surahData && surahData.verses) {
    for (const verse of surahData.verses) {
      const quranVerse: QuranVerse = {
        surahId: surahNumber,
        ayahNumber: verse.number.inSurah,
        arabicText: verse.text.arab,
        translationId: verse.translation?.id || 'id',
        translationText: verse.translation?.id || '',
        transliteration: verse.text.transliteration?.en
      };
      
      try {
        cacheQuranVerse(quranVerse);
      } catch (error) {
        console.warn('Failed to cache verse:', error);
      }
    }
  }
  
  memoryCache.set(cacheKey, surahData);
  return surahData;
}

// Hadith API with caching
export async function getCachedHadithCollections(): Promise<HadithCollectionSummary[]> {
  return fetchFromApi<HadithCollectionSummary[]>(API_BASE_URL_HADITH, '/books');
}

export async function getCachedHadiths(
  collectionId: string,
  range = '1-10',
  useCache: boolean = true
): Promise<HadithCollectionDetail> {
  const cacheKey = `hadith_${collectionId}_${range}`;
  
  if (useCache && memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const searchParams = new URLSearchParams();
  searchParams.set('range', range);
  
  const hadithData = await fetchFromApi<HadithCollectionDetail>(
    API_BASE_URL_HADITH, 
    `/books/${collectionId}?${searchParams.toString()}`
  );
  
  // Cache individual hadiths in SQLite
  if (hadithData && hadithData.hadiths) {
    for (const hadith of hadithData.hadiths) {
      const hadithCache: HadithData = {
        collectionId,
        hadithNumber: hadith.number,
        arabicText: hadith.arab,
        translationText: hadith.id, // Using id as translation for now
      };
      
      try {
        cacheHadith(hadithCache);
      } catch (error) {
        console.warn('Failed to cache hadith:', error);
      }
    }
  }
  
  memoryCache.set(cacheKey, hadithData);
  return hadithData;
}

export async function getCachedSingleHadith(
  collectionId: string, 
  number: number,
  useCache: boolean = true
): Promise<HadithEntry> {
  // Check SQLite cache first
  if (useCache) {
    const cached = getCachedHadith(collectionId, number);
    if (cached) {
      return {
        number: cached.hadithNumber,
        arab: cached.arabicText,
        id: cached.translationText
      };
    }
  }
  
  const detail = await getCachedHadiths(collectionId, `${number}-${number}`, useCache);
  return detail.hadiths[0];
}

// Search with caching
export interface SearchResult {
  type: 'quran' | 'hadith';
  surahId?: number;
  ayahNumber?: number;
  collectionId?: string;
  hadithNumber?: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
  narrator?: string;
  grade?: string;
}

export async function searchQuranWithCache(
  query: string,
  useCache: boolean = true
): Promise<SearchResult[]> {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check cache first
  if (useCache) {
    const cached = getCachedSearchResults(normalizedQuery, 'quran');
    if (cached) {
      return cached;
    }
  }
  
  // If not in cache, perform search
  // This is a simplified search - in production you might want more sophisticated search
  const results: SearchResult[] = [];
  
  try {
    // Search through cached verses in SQLite
    // For now, we'll implement a basic search that can be enhanced later
    const surahs = await getCachedSurahs();
    
    for (const surah of surahs.slice(0, 5)) { // Limit for demo
      try {
        const surahData = await getCachedSurah(surah.number);
        
        if (surahData.verses) {
          for (const verse of surahData.verses) {
            const arabicMatch = verse.text.arab.includes(query);
            const translationMatch = verse.translation?.id?.toLowerCase().includes(normalizedQuery);
            const transliterationMatch = verse.text.transliteration?.en?.toLowerCase().includes(normalizedQuery);
            
            if (arabicMatch || translationMatch || transliterationMatch) {
              results.push({
                type: 'quran',
                surahId: surah.number,
                ayahNumber: verse.number.inSurah,
                arabicText: verse.text.arab,
                translation: verse.translation?.id || '',
                transliteration: verse.text.transliteration?.en
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to search surah ${surah.number}:`, error);
      }
    }
    
    // Cache the results
    if (results.length > 0) {
      cacheSearchResults(normalizedQuery, 'quran', results, 24); // Cache for 24 hours
    }
    
  } catch (error) {
    console.error('Search failed:', error);
  }
  
  return results;
}

export async function searchHadithWithCache(
  query: string,
  useCache: boolean = true
): Promise<SearchResult[]> {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check cache first
  if (useCache) {
    const cached = getCachedSearchResults(normalizedQuery, 'hadith');
    if (cached) {
      return cached;
    }
  }
  
  const results: SearchResult[] = [];
  
  try {
    const collections = await getCachedHadithCollections();
    
    for (const collection of collections.slice(0, 3)) { // Limit for demo
      try {
        const hadithData = await getCachedHadiths(collection.id, '1-50'); // Limited range
        
        if (hadithData.hadiths) {
          for (const hadith of hadithData.hadiths) {
            const arabicMatch = hadith.arab.includes(query);
            const translationMatch = hadith.id.toLowerCase().includes(normalizedQuery);
            
            if (arabicMatch || translationMatch) {
              results.push({
                type: 'hadith',
                collectionId: collection.id,
                hadithNumber: hadith.number,
                arabicText: hadith.arab,
                translation: hadith.id
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to search collection ${collection.id}:`, error);
      }
    }
    
    // Cache the results
    if (results.length > 0) {
      cacheSearchResults(normalizedQuery, 'hadith', results, 24);
    }
    
  } catch (error) {
    console.error('Hadith search failed:', error);
  }
  
  return results;
}

// Combined search function
export async function searchWithCache(
  query: string,
  type?: 'quran' | 'hadith' | 'both',
  useCache: boolean = true
): Promise<{ quran: SearchResult[]; hadith: SearchResult[] }> {
  const searchType = type || 'both';
  
  const results = {
    quran: [] as SearchResult[],
    hadith: [] as SearchResult[]
  };
  
  if (searchType === 'quran' || searchType === 'both') {
    results.quran = await searchQuranWithCache(query, useCache);
  }
  
  if (searchType === 'hadith' || searchType === 'both') {
    results.hadith = await searchHadithWithCache(query, useCache);
  }
  
  return results;
}

// Cache warming functions
export async function warmQuranCache(surahNumbers?: number[]): Promise<void> {
  const surahs = await getCachedSurahs();
  const targetSurahs = surahNumbers ? 
    surahs.filter(s => surahNumbers.includes(s.number)) : 
    surahs.slice(0, 10); // Warm first 10 surahs by default
  
  for (const surah of targetSurahs) {
    try {
      await getCachedSurah(surah.number, false); // Force refresh
      console.log(`Warmed cache for Surah ${surah.number}`);
    } catch (error) {
      console.warn(`Failed to warm cache for Surah ${surah.number}:`, error);
    }
  }
}

export async function warmHadithCache(collectionIds?: string[]): Promise<void> {
  const collections = await getCachedHadithCollections();
  const targetCollections = collectionIds ? 
    collections.filter(c => collectionIds.includes(c.id)) : 
    collections.slice(0, 3); // Warm first 3 collections by default
  
  for (const collection of targetCollections) {
    try {
      await getCachedHadiths(collection.id, '1-100', false); // Force refresh
      console.log(`Warmed cache for collection ${collection.id}`);
    } catch (error) {
      console.warn(`Failed to warm cache for collection ${collection.id}:`, error);
    }
  }
}

// Cache refresh functions
export async function refreshQuranCache(): Promise<void> {
  console.log('Refreshing Quran cache...');
  
  // Clear existing cache
  const db = getDatabase();
  db.prepare('DELETE FROM quran_cache WHERE created_at < datetime("now", "-7 days")').run();
  
  // Re-warm cache
  await warmQuranCache();
  console.log('Quran cache refreshed successfully');
}

export async function refreshHadithCache(): Promise<void> {
  console.log('Refreshing Hadith cache...');
  
  // Clear existing cache
  const db = getDatabase();
  db.prepare('DELETE FROM hadith_cache WHERE created_at < datetime("now", "-7 days")').run();
  
  // Re-warm cache
  await warmHadithCache();
  console.log('Hadith cache refreshed successfully');
}

export async function refreshSearchCache(): Promise<void> {
  console.log('Refreshing search cache...');
  
  // Clear old search cache (older than 1 day)
  const db = getDatabase();
  db.prepare('DELETE FROM search_cache WHERE created_at < datetime("now", "-1 day")').run();
  
  console.log('Search cache refreshed successfully');
}

// Periodic cache refresh (call this on app startup)
export function startCacheRefreshScheduler(): void {
  // Refresh cache every 6 hours
  const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  
  setInterval(async () => {
    try {
      await refreshSearchCache();
      // Refresh Quran and Hadith cache less frequently (once per day)
      const now = new Date();
      if (now.getHours() === 2) { // Refresh at 2 AM
        await refreshQuranCache();
        await refreshHadithCache();
      }
    } catch (error) {
      console.error('Cache refresh failed:', error);
    }
  }, REFRESH_INTERVAL);
  
  console.log('Cache refresh scheduler started');
}

// Clear memory cache
export function clearMemoryCache(): void {
  memoryCache.clear();
}

// Get cache statistics
export async function getCacheInfo(): Promise<{ memorySize: number; sqliteStats: any }> {
  return {
    memorySize: memoryCache.size,
    sqliteStats: 'Use getCacheStats() from database.ts'
  };
}