'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { loadUserHadithNotes, saveUserHadithNotes } from '@/app/actions';
import type { HadithEntry } from '@/lib/hadith-api';
import { HadithItem } from './hadith-item';
import { HadithSidebar } from './hadith-sidebar';

interface HadithReaderProps {
  collectionId: string;
  collectionName: string;
  range: string;
  hadiths: HadithEntry[];
}

export interface HadithBookmark {
  collectionId: string;
  collectionName: string;
  number: number;
  excerpt: string;
}

export function HadithReader({ collectionId, collectionName, range, hadiths }: HadithReaderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [bookmarks, setBookmarks] = useState<HadithBookmark[]>([]);
  const hadithRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
    const ref = hadithRefs.current[bookmark.number];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      <section className="flex-1 space-y-6">
        {hadiths.map(hadith => (
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
              range={range}
              isBookmarked={bookmarks.some(bookmark => bookmark.collectionId === collectionId && bookmark.number === hadith.number)}
              onToggleBookmark={toggleBookmark}
              onAddToNotes={addHadithSnippet}
              onAddSummaryToNotes={addSummarySnippet}
            />
          </div>
        ))}
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
