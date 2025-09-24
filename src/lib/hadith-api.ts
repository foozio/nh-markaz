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
