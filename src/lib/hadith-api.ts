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
const DEFAULT_MAX_HADITH = 600;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 300;

const cache = new Map<string, { data: unknown; expiresAt: number }>();
import { logError, logInfo } from './logging';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
  error: boolean;
};

async function fetchWithRetry(endpoint: string, init?: RequestInit, attempt = 0): Promise<Response> {
  try {
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

    return response;
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS * (attempt + 1));
      return fetchWithRetry(endpoint, init, attempt + 1);
    }
    logError('hadith.fetch_failed', error, { endpoint, attempt });
    throw error;
  }
}

async function fetchFromApi<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data as T;
  }

  const response = await fetchWithRetry(endpoint, init);
  const payload = (await response.json()) as ApiResponse<T>;

  if (payload.error || payload.code !== 200) {
    const message = payload.message || 'Hadith API returned an error';
    logError('hadith.fetch_error_payload', new Error(message), { endpoint });
    throw new Error(message);
  }

  cache.set(endpoint, { data: payload.data, expiresAt: Date.now() + CACHE_TTL_MS });
  return payload.data;
}

export async function getHadithCollections(): Promise<HadithCollectionSummary[]> {
  const data = await fetchFromApi<HadithCollectionSummary[]>('/books');
  logInfo('hadith.collections.loaded', { count: data.length });
  return data;
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

  const data = await fetchFromApi<HadithCollectionDetail>(`/books/${collectionId}?${searchParams.toString()}`);
  logInfo('hadith.collection.range_loaded', { collectionId, range, count: data.hadiths.length });
  return data;
}

export async function getSingleHadith(collectionId: string, number: number): Promise<HadithEntry> {
  const detail = await getHadiths(collectionId, `${number}-${number}`);
  // When a single number is requested, API still wraps data.hadiths array with length 1
  return detail.hadiths[0];
}

export async function getCompleteHadithCollection(
  collectionId: string,
  totalAvailable?: number,
  maxTotal: number = DEFAULT_MAX_HADITH,
): Promise<HadithCollectionDetail & { truncated: boolean }> {
  if (!collectionId) {
    throw new Error('collectionId is required');
  }

  const targetTotal = totalAvailable && totalAvailable > 0 ? totalAvailable : null;
  const effectiveCap = maxTotal > 0 ? Math.min(maxTotal, targetTotal ?? Number.MAX_SAFE_INTEGER) : targetTotal ?? Number.MAX_SAFE_INTEGER;
  const initialEnd = Math.min(effectiveCap, MAX_RANGE_SIZE);
  const initialRangeEnd = Math.max(initialEnd, 1);
  const initialDetail = await getHadiths(collectionId, `1-${initialRangeEnd}`);

  const available = initialDetail.available;
  const effectiveTotal = Math.min(available, effectiveCap);
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
    truncated: available > effectiveTotal,
  };
}
