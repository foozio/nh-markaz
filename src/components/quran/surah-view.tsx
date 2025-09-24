
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Surah } from '@/lib/quran-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VerseItem } from './verse-item';
import { Separator } from '../ui/separator';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SurahViewProps {
  surah: Surah | null;
  isLoading: boolean;
}

const VERSES_PER_PAGE = 10;

export function SurahView({ surah, isLoading }: SurahViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [surah]);

  const totalPages = surah
    ? Math.ceil(surah.verses.length / VERSES_PER_PAGE)
    : 0;

  const paginatedVerses = useMemo(() => {
    if (!surah) return [];
    const startIndex = (currentPage - 1) * VERSES_PER_PAGE;
    const endIndex = startIndex + VERSES_PER_PAGE;
    return surah.verses.slice(startIndex, endIndex);
  }, [surah, currentPage]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-2xl font-bold font-headline">Loading Surah...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-headline">Select a Surah</h2>
          <p className="text-muted-foreground">
            Choose a Surah from the list to begin reading.
          </p>
        </div>
      </div>
    );
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-auto flex-shrink-0 items-center justify-between gap-6 border-b p-4 lg:p-6">
        <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              {surah.name.transliteration.en} - {surah.name.translation.en}
            </h2>
            <p className="text-muted-foreground">{surah.numberOfVerses} verses</p>
        </div>
        <div className="flex items-center justify-end">
            <h1 dir="rtl" className="font-quran text-3xl font-bold text-primary">
                {surah.name.long}
            </h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6">
              <div className="space-y-4">
                  {paginatedVerses.map((verse, index) => (
                      <div key={verse.number.inQuran}>
                          <VerseItem verse={verse} surahId={surah.number} />
                          {index < paginatedVerses.length - 1 && <Separator className="my-6" />}
                      </div>
                  ))}
              </div>
          </div>
      </ScrollArea>
      
      {totalPages > 1 && (
        <div className="flex flex-shrink-0 items-center justify-center gap-4 border-t p-4">
            <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      )}
    </div>
  );
}
