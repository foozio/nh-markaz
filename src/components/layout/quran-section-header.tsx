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
    <div className="border-b bg-gradient-to-r from-background/95 to-background/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Al-Qur'an
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {selectedSurah 
              ? `Baca ${selectedSurah.name.transliteration.en} (${selectedSurah.name.translation.id})`
              : 'Pilih surah untuk mulai membaca'
            }
          </p>
        </div>
        
        <div className="w-72">
          <Select
            value={selectedSurah?.number.toString() || ''}
            onValueChange={handleValueChange}
            disabled={isLoading || surahs.length === 0}
          >
            <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors duration-200 bg-background/50 backdrop-blur">
              <SelectValue 
                placeholder={isLoading ? 'Memuat Surah...' : 'Pilih Surah'} 
              />
            </SelectTrigger>
            <SelectContent className="max-h-[350px] border-2 border-border/50 bg-background/95 backdrop-blur">
              {surahs.map((surah) => (
                <SelectItem 
                  key={surah.number} 
                  value={surah.number.toString()}
                  className="hover:bg-primary/10 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-foreground">
                      {surah.number}. {surah.name.transliteration.en}
                    </span>
                    <span className="text-sm text-muted-foreground ml-3 font-medium flex-shrink-0">
                      ({surah.numberOfVerses || 0} ayat)
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}