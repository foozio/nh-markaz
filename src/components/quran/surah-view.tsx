
'use client';

import { useMemo, MutableRefObject } from 'react';
import type { Surah, Ayah } from '@/lib/quran-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VerseItem } from './verse-item';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';

interface SurahViewProps {
  surah: Surah | null;
  isLoading: boolean;
  onAddToNotes: (verse: Ayah) => void;
  onAddSummaryToNotes: (summary: string, verse: Ayah) => void;
  onToggleBookmark: (surahNumber: number, verseNumber: number, surahName: string, verseText: string) => void;
  isVerseBookmarked: (surahNumber: number, verseNumber: number) => boolean;
  verseRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function SurahView({ 
    surah, 
    isLoading, 
    onAddToNotes, 
    onAddSummaryToNotes,
    onToggleBookmark,
    isVerseBookmarked,
    verseRefs
}: SurahViewProps) {
  
  const verses = useMemo(() => {
    if (!surah) return [];
    return surah.verses;
  }, [surah]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-2xl font-bold font-headline">Memuat Surah...</h2>
            <p className="text-muted-foreground">Silakan tunggu sebentar.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-headline">Pilih Surah</h2>
          <p className="text-muted-foreground">
            Pilih surah dari daftar untuk mulai membaca.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-auto flex-shrink-0 items-center justify-between gap-6 border-b p-4 lg:p-6">
        <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              {surah.name.transliteration.en} - {surah.name.translation.id}
            </h2>
            <p className="text-muted-foreground">{surah.numberOfVerses} ayat</p>
        </div>
        <div className="flex items-center justify-end">
            <h1 dir="rtl" className="font-naskh text-4xl font-bold text-primary">
                {surah.name.long}
            </h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6">
              <div className="space-y-4">
                  {verses.map((verse, index) => (
                      <div 
                        key={verse.number.inQuran}
                        ref={el => verseRefs.current[`${surah.number}:${verse.number.inSurah}`] = el}
                      >
                          <VerseItem 
                            verse={verse} 
                            surahId={surah.number}
                            surahName={surah.name.transliteration.en}
                            onAddToNotes={() => onAddToNotes(verse)}
                            onAddSummaryToNotes={(summary) => onAddSummaryToNotes(summary, verse)}
                            onToggleBookmark={onToggleBookmark}
                            isBookmarked={isVerseBookmarked(surah.number, verse.number.inSurah)}
                          />
                          {index < verses.length - 1 && <Separator className="my-6" />}
                      </div>
                  ))}
              </div>
          </div>
      </ScrollArea>
      
    </div>
  );
}
