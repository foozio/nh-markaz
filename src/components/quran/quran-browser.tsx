
'use client';

import { useEffect, useState, useRef } from 'react';
import type { Surah, SurahSummary, Ayah, Bookmark } from '@/lib/quran-data';
import { getSurah, getSurahs } from '@/lib/quran-api';
import { SurahView } from './surah-view';
import { RightSidebar } from './right-sidebar';
import { QuranHeader } from '@/components/layout/quran-header';

export function QuranBrowser() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahSummary, setSelectedSurahSummary] = useState<SurahSummary | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [notes, setNotes] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const surahList = await getSurahs();
        setSurahs(surahList);
        if (surahList.length > 0) {
          await handleSelectSurah(surahList[0]);
        }
      } catch (error) {
        console.error('Gagal memuat surah:', error);
      } finally {
        setIsLoadingSurahs(false);
      }
    }
    fetchSurahs();
  }, []);

  const handleSelectSurah = async (surahSummary: SurahSummary, verseNumber?: number) => {
    if (selectedSurahSummary?.number === surahSummary.number && !verseNumber) return;

    setIsLoadingSurah(true);
    setSelectedSurahSummary(surahSummary);
    setSelectedSurah(null);
    try {
      const surahDetail = await getSurah(surahSummary.number);
      setSelectedSurah(surahDetail);
      
      if (verseNumber) {
        setTimeout(() => {
            const verseId = `${surahSummary.number}:${verseNumber}`;
            verseRefs.current[verseId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

    } catch (error) {
      console.error(`Gagal memuat surah ${surahSummary.number}:`, error);
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
    const arabicText = `<p style="text-align: right; font-family: 'Noto Naskh Arabic', serif; font-size: 1.5rem;">${verse.text.arab}</p>`;
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

  return (
    <div className="flex h-screen w-full">
        <main className="flex flex-1 flex-col">
            <QuranHeader 
                surahs={surahs}
                selectedSurah={selectedSurahSummary}
                onSelectSurah={handleSelectSurah}
                isLoading={isLoadingSurahs}
            />
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
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
                <RightSidebar 
                    surah={selectedSurah}
                    notes={notes}
                    onNotesChange={setNotes}
                    bookmarks={bookmarks}
                    onNavigateToVerse={handleNavigateToVerse}
                />
            </div>
        </main>
    </div>
  );
}
