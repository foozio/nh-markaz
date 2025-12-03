import { describe, expect, test } from 'vitest';
import { getSurahs, getSurah } from '@/lib/quran-api';

describe('Quran API smoke', () => {
  test('fetches surah list', async () => {
    const surahs = await getSurahs();
    expect(Array.isArray(surahs)).toBe(true);
    expect(surahs.length).toBeGreaterThan(0);
  });

  test('fetches a single surah detail', async () => {
    const surah = await getSurah(1);
    expect(surah.number).toBe(1);
    expect(surah.verses.length).toBeGreaterThan(0);
  });
});
