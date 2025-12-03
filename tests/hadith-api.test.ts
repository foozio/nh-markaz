import { describe, expect, test } from 'vitest';
import { getHadithCollections, getHadiths } from '@/lib/hadith-api';

describe('Hadith API smoke', () => {
  test('fetches collection list', async () => {
    const collections = await getHadithCollections();
    expect(Array.isArray(collections)).toBe(true);
    expect(collections.length).toBeGreaterThan(0);
  });

  test('fetches first hadith of first collection', async () => {
    const collections = await getHadithCollections();
    const first = collections[0];
    const detail = await getHadiths(first.id, '1-1');
    expect(detail.hadiths.length).toBeGreaterThan(0);
    expect(detail.hadiths[0].number).toBe(1);
  });
});
