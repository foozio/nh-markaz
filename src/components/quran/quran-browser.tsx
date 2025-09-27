
'use client';

import { useEffect, useState, useRef } from 'react';
import type { Surah, SurahSummary, Ayah, Bookmark } from '@/lib/quran-data';
// Removed server action imports - using API endpoints instead
import { SurahView } from './surah-view';
import { RightSidebar } from './right-sidebar';
import { MainHeader } from '@/components/layout/main-header';
import { QuranSectionHeader } from '@/components/layout/quran-section-header';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { loadUserNotes, saveUserNotes } from '@/app/actions';

export function QuranBrowser({ initialSurahNumber }: { initialSurahNumber?: number } = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahSummary, setSelectedSurahSummary] = useState<SurahSummary | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function fetchInitialData() {
      if (!user) return;
      setIsLoadingSurahs(true);
      setIsLoadingNotes(true);

      try {
        // Fetch surahs using API endpoint
        const response = await fetch('/api/surahs');
        if (!response.ok) {
          throw new Error('Failed to load surahs');
        }
        const data = await response.json();
        const surahList = data.surahs || [];
        setSurahs(surahList);
        if (surahList.length > 0) {
          // Use initialSurahNumber if provided, otherwise default to first surah
          const targetSurah = initialSurahNumber 
            ? surahList.find((s: SurahSummary) => s.number === initialSurahNumber) || surahList[0]
            : surahList[0];
          await handleSelectSurah(targetSurah);
        }
      } catch (error) {
        console.error('Gagal memuat surah:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar surah.' });
      } finally {
        setIsLoadingSurahs(false);
      }

      // Fetch notes
      try {
        const { notes: loadedNotes, error } = await loadUserNotes();
        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat catatan.' });
        } else if (loadedNotes) {
          setNotes(loadedNotes);
        }
      } catch (error) {
        console.error('Gagal memuat catatan:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat catatan.' });
      } finally {
        setIsLoadingNotes(false);
      }
    }
    fetchInitialData();
  }, [user]);

  const handleSelectSurah = async (surahSummary: SurahSummary, verseNumber?: number) => {
    if (selectedSurahSummary?.number === surahSummary.number && !verseNumber) return;

    setIsLoadingSurah(true);
    setSelectedSurahSummary(surahSummary);
    setSelectedSurah(null);
    try {
      // Use API endpoint for fetching surah details
      const response = await fetch(`/api/surah/${surahSummary.number}`);
      if (!response.ok) {
        throw new Error(`Failed to load surah ${surahSummary.number}`);
      }
      const data = await response.json();
      const surahDetail = data.surah;
      setSelectedSurah(surahDetail);
      
      if (verseNumber) {
        setTimeout(() => {
            const verseId = `${surahSummary.number}:${verseNumber}`;
            verseRefs.current[verseId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

    } catch (error) {
      console.error(`Gagal memuat surah ${surahSummary.number}:`, error);
      toast({ variant: 'destructive', title: 'Error', description: `Gagal memuat surah ${surahSummary.number}.` });
    } finally {
      setIsLoadingSurah(false);
    }
  };

  const handleNavigateToVerse = (bookmark: Bookmark) => {
    const surahToSelect = surahs.find(s => s.number === bookmark.surahNumber);
    if (surahToSelect) {
        if (selectedSurah?.number !== bookmark.surahNumber) {
            handleSelectSurah(surahToSelect, bookmark.verseNumber);
        } else {
             const verseId = `${bookmark.surahNumber}:${bookmark.verseNumber}`;
             verseRefs.current[verseId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }

  const handleAddToNotes = (verse: Ayah) => {
    const verseReference = `<h2>Surah ${selectedSurah?.name.transliteration.en} (${selectedSurah?.number}:${verse.number.inSurah})</h2>`;
    const arabicText = `<p class="text-right font-naskh text-2xl leading-relaxed" lang="ar" dir="rtl">${verse.text.arab}</p>`;
    const englishTranslation = `<blockquote>${verse.translation.id}</blockquote><p></p>`;
    const noteText = `${verseReference}${arabicText}${englishTranslation}`;
    
    setNotes(prevNotes => prevNotes ? `${prevNotes}${noteText}` : noteText);
  };

  const handleAddSummaryToNotes = (summary: string, verse: Ayah) => {
    const summaryReference = `<h3>Ringkasan AI untuk Surah ${selectedSurah?.name.transliteration.en} (${selectedSurah?.number}:${verse.number.inSurah})</h3>`;
    const summaryText = `<p>${summary}</p><p></p>`;
    const noteText = `${summaryReference}${summaryText}`;
    
    setNotes(prevNotes => prevNotes ? `${prevNotes}${noteText}` : noteText);
  };

  const isVerseBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.verseNumber === verseNumber);
  }

  const handleToggleBookmark = (surahNumber: number, verseNumber: number, surahName: string, verseText: string) => {
    setBookmarks(prev => {
        const existing = isVerseBookmarked(surahNumber, verseNumber);
        if (existing) {
            return prev.filter(b => !(b.surahNumber === surahNumber && b.verseNumber === verseNumber));
        } else {
            return [...prev, { surahNumber, verseNumber, surahName, text: verseText }];
        }
    });
  }

  const handleSaveNotes = async () => {
    if (!user) return;
    setIsSavingNotes(true);
    try {
      const { success, error } = await saveUserNotes(notes);
      if (success) {
        toast({
          title: 'Catatan Disimpan',
          description: 'Catatan Anda telah berhasil disimpan.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Gagal Menyimpan',
          description: error,
        });
      }
    } catch (error) {
      console.error('Gagal menyimpan catatan:', error);
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
    <div className="flex h-screen w-full flex-col">
        <MainHeader />
        <main className="flex flex-1 flex-col">
            <QuranSectionHeader
                surahs={surahs}
                selectedSurah={selectedSurahSummary}
                onSelectSurah={handleSelectSurah}
                isLoading={isLoadingSurahs}
            />
            <div className="flex w-full flex-col md:flex-row">
                <div className="flex-1" role="region" aria-label="Quran Content">
                    <SurahView
                        surah={selectedSurah}
                        isLoading={isLoadingSurah || isLoadingSurahs}
                        onAddToNotes={handleAddToNotes}
                        onAddSummaryToNotes={handleAddSummaryToNotes}
                        onToggleBookmark={handleToggleBookmark}
                        isVerseBookmarked={isVerseBookmarked}
                        verseRefs={verseRefs}
                    />
                </div>
                <div className="hidden md:block">
                    <RightSidebar
                        surah={selectedSurah}
                        notes={notes}
                        onNotesChange={setNotes}
                        bookmarks={bookmarks}
                        onNavigateToVerse={handleNavigateToVerse}
                        onSaveNotes={handleSaveNotes}
                        isSavingNotes={isSavingNotes}
                        isLoadingNotes={isLoadingNotes}
                    />
                </div>
            </div>
        </main>
    </div>
  );
}
