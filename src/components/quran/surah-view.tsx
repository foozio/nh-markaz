
'use client';

import { useMemo, useState, MutableRefObject, useEffect, useRef } from 'react';
import type { Surah, Ayah } from '@/lib/quran-data';
import { VerseItem } from './verse-item';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 10;
  const scrollableViewRef = useRef<HTMLDivElement>(null);

  const verses = useMemo(() => {
    if (!surah) return [];
    return surah.verses;
  }, [surah]);

  const totalPages = Math.ceil(verses.length / versesPerPage);
  const startIndex = (currentPage - 1) * versesPerPage;
  const endIndex = startIndex + versesPerPage;
  const currentVerses = verses.slice(startIndex, endIndex);

  // Reset to page 1 when surah changes
  useEffect(() => {
    setCurrentPage(1);
  }, [surah?.number]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    scrollableViewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-muted/40">
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
      <div className="flex min-h-[300px] items-center justify-center bg-muted/40">
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
    <div className="flex flex-col">
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

      <div ref={scrollableViewRef}>
          <div className="p-4 lg:p-6">
              <div className="space-y-4">
                  {currentVerses.map((verse, index) => (
                      <div
                        key={verse.number.inQuran}
                        ref={(el) => {
                          verseRefs.current[`${surah.number}:${verse.number.inSurah}`] = el;
                        }}
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
                          {index < currentVerses.length - 1 && <Separator className="my-6" />}
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t bg-background px-4 py-3 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span>
              Ayat {startIndex + 1}-{Math.min(endIndex, verses.length)} dari {verses.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>

            <div className="flex items-center gap-1">
              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="h-8 w-8 p-0"
                    aria-label={`Halaman ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
