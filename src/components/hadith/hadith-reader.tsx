'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { loadUserHadithNotes, saveUserHadithNotes } from '@/app/actions';
import type { HadithEntry } from '@/lib/hadith-api';
import { HadithItem } from './hadith-item';
import { HadithSidebar } from './hadith-sidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HadithReaderProps {
  collectionId: string;
  collectionName: string;
  hadiths: HadithEntry[];
}

export interface HadithBookmark {
  collectionId: string;
  collectionName: string;
  number: number;
  excerpt: string;
}

export function HadithReader({ collectionId, collectionName, hadiths }: HadithReaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [bookmarks, setBookmarks] = useState<HadithBookmark[]>([]);
  const hadithRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingScrollNumber, setPendingScrollNumber] = useState<number | null>(null);
  const hadithsPerPage = 10;

  const totalPages = Math.ceil(hadiths.length / hadithsPerPage);
  const startIndex = (currentPage - 1) * hadithsPerPage;
  const endIndex = startIndex + hadithsPerPage;
  const currentHadiths = hadiths.slice(startIndex, endIndex);
  const pageRangeLabel = `${startIndex + 1}-${Math.min(endIndex, hadiths.length)}`;

  useEffect(() => {
    let mounted = true;

    async function fetchNotes() {
      if (!user) {
        setNotes('');
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      try {
        const { notes: loadedNotes, error } = await loadUserHadithNotes(collectionId);
        if (!mounted) return;
        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat catatan hadith.' });
        } else if (loadedNotes) {
          setNotes(loadedNotes);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Gagal memuat catatan hadith:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Terjadi kesalahan saat memuat catatan.' });
      } finally {
        if (mounted) {
          setIsLoadingNotes(false);
        }
      }
    }

    fetchNotes();

    return () => {
      mounted = false;
    };
  }, [user, collectionId, toast]);

  useEffect(() => {
    setCurrentPage(1);
    setPendingScrollNumber(null);
  }, [collectionId, hadiths.length]);

  useEffect(() => {
    if (!listContainerRef.current) return;
    listContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  useEffect(() => {
    if (pendingScrollNumber === null) return;
    const targetRef = hadithRefs.current[pendingScrollNumber];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingScrollNumber(null);
    }
  }, [currentHadiths, pendingScrollNumber]);

  const addHadithSnippet = (hadith: HadithEntry) => {
    const header = `<h2>${collectionName} - Hadith #${hadith.number}</h2>`;
    const arabic = `<p class="text-right font-naskh text-xl leading-loose" lang="ar" dir="rtl">${hadith.arab}</p>`;
    const translation = `<blockquote>${hadith.id}</blockquote><p></p>`;
    const snippet = `${header}${arabic}${translation}`;

    setNotes(prev => (prev ? `${prev}${snippet}` : snippet));
  };

  const addSummarySnippet = (summary: string, hadith: HadithEntry) => {
    const header = `<h3>Ringkasan AI - ${collectionName} Hadith #${hadith.number}</h3>`;
    const snippet = `${header}<p>${summary}</p><p></p>`;
    setNotes(prev => (prev ? `${prev}${snippet}` : snippet));
  };

  const toggleBookmark = (hadith: HadithEntry) => {
    setBookmarks(prev => {
      const exists = prev.some(item => item.collectionId === collectionId && item.number === hadith.number);
      if (exists) {
        return prev.filter(item => !(item.collectionId === collectionId && item.number === hadith.number));
      }
      const excerpt = hadith.id.length > 120 ? `${hadith.id.slice(0, 117)}...` : hadith.id;
      return [
        ...prev,
        {
          collectionId,
          collectionName,
          number: hadith.number,
          excerpt,
        },
      ];
    });
  };

  const navigateToBookmark = (bookmark: HadithBookmark) => {
    const targetPage = Math.ceil(bookmark.number / hadithsPerPage);
    setPendingScrollNumber(bookmark.number);
    setCurrentPage(targetPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSaveNotes = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Tidak Masuk',
        description: 'Silakan masuk untuk menyimpan catatan hadith.',
      });
      return;
    }

    setIsSavingNotes(true);
    try {
      const { success, error } = await saveUserHadithNotes(collectionId, notes);
      if (success) {
        toast({ title: 'Catatan Disimpan', description: 'Catatan hadith berhasil diperbarui.' });
      } else {
        toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: error });
      }
    } catch (error) {
      console.error('Gagal menyimpan catatan hadith:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Menyimpan',
        description: 'Tidak dapat memverifikasi sesi Anda. Silakan masuk kembali.',
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <section className="flex-1">
        <div ref={listContainerRef} className="space-y-6">
          {currentHadiths.map(hadith => (
            <div
            key={hadith.number}
            ref={el => {
              hadithRefs.current[hadith.number] = el;
            }}
            className="rounded-lg border bg-card/60 p-6 shadow-sm"
          >
            <HadithItem
              hadith={hadith}
              collectionName={collectionName}
              range={pageRangeLabel}
              isBookmarked={bookmarks.some(bookmark => bookmark.collectionId === collectionId && bookmark.number === hadith.number)}
              onToggleBookmark={toggleBookmark}
              onAddToNotes={addHadithSnippet}
              onAddSummaryToNotes={addSummarySnippet}
            />
          </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Menampilkan hadith {startIndex + 1}-{Math.min(endIndex, hadiths.length)} dari {hadiths.length}
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = currentPage - 2 + index;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="h-8 w-8 p-0"
                      aria-label={`Halaman ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
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
      </section>

      <HadithSidebar
        collectionName={collectionName}
        notes={notes}
        onNotesChange={setNotes}
        bookmarks={bookmarks}
        onNavigateToHadith={navigateToBookmark}
        onSaveNotes={handleSaveNotes}
        isSavingNotes={isSavingNotes}
        isLoadingNotes={isLoadingNotes}
        isAuthenticated={Boolean(user)}
      />
    </div>
  );
}
