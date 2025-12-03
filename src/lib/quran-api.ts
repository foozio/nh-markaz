import type { Surah, SurahSummary } from './quran-data';
import { logError, logInfo } from './logging';

const API_BASE_URL = 'https://api.quran.gading.dev';

const cache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 200;

async function fetchWithRetry(endpoint: string, attempt = 0): Promise<Response> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
      return fetchWithRetry(endpoint, attempt + 1);
    }
    logError('quran.fetch_failed', error, { endpoint, attempt });
    throw error;
  }
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    const response = await fetchWithRetry(endpoint);
    const data = await response.json();

    if (data.code !== 200) {
        throw new Error(data.message || 'API returned an error');
    }

    cache.set(endpoint, { data: data.data, expiresAt: Date.now() + CACHE_TTL_MS });
    return data.data;
  } catch (error) {
    logError('quran.fetch_failed', error, { endpoint });
    throw error;
  }
}

export async function getSurahs(): Promise<SurahSummary[]> {
  const data = await fetchFromApi<SurahSummary[]>('/surah');
  logInfo('quran.surah_list.loaded', { count: data.length });
  return data;
}

export async function getSurah(surahNumber: number): Promise<Surah> {
    const surahData = await fetchFromApi<Surah>(`/surah/${surahNumber}`);
    logInfo('quran.surah.loaded', { surahNumber, verses: surahData.verses.length });
    return surahData;
}
