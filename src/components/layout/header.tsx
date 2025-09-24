'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SurahSummary } from '@/lib/quran-data';

export function Header({
  surahs,
  selectedSurah,
  onSelectSurah,
  isLoading,
}: {
  surahs: SurahSummary[];
  selectedSurah: SurahSummary | null;
  onSelectSurah: (surah: SurahSummary) => void;
  isLoading: boolean;
}) {
  const handleValueChange = (value: string) => {
    const surah = surahs.find((s) => s.number.toString() === value);
    if (surah) {
      onSelectSurah(surah);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <MoonStarIcon className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Markaz
        </h1>
      </div>
      <div className="w-64">
        <Select
          onValueChange={handleValueChange}
          value={selectedSurah?.number.toString()}
          disabled={isLoading || surahs.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Loading Surahs..." : "Select a Surah"} />
          </SelectTrigger>
          <SelectContent>
            {surahs.map((surah) => (
              <SelectItem key={surah.number} value={surah.number.toString()}>
                {surah.number}. {surah.name.transliteration.en} ({surah.name.translation.en})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

function MoonStarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="hsl(var(--accent))" stroke="hsl(var(--accent))"/>
    </svg>
  );
}
