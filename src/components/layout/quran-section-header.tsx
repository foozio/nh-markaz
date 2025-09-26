'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SurahSummary } from '@/lib/quran-data';

interface QuranSectionHeaderProps {
  surahs: SurahSummary[];
  selectedSurah: SurahSummary | null;
  onSelectSurah: (surah: SurahSummary) => void;
  isLoading: boolean;
}

export function QuranSectionHeader({
  surahs,
  selectedSurah,
  onSelectSurah,
  isLoading,
}: QuranSectionHeaderProps) {
  const handleValueChange = (value: string) => {
    const surah = surahs.find((s) => s.number.toString() === value);
    if (surah) {
      onSelectSurah(surah);
    }
  };

  return (
    <div className="border-b bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-lg font-semibold">Bacaan Quran</h2>
          <p className="text-sm text-muted-foreground">Pilih surah untuk mulai membaca</p>
        </div>
        <div className="w-64">
          <Select
            onValueChange={handleValueChange}
            value={selectedSurah?.number.toString()}
            disabled={isLoading || surahs.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Memuat Surah...' : 'Pilih Surah'} />
            </SelectTrigger>
            <SelectContent>
              {surahs.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                  {surah.number}. {surah.name.transliteration.en} ({surah.name.translation.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}