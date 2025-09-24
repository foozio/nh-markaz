
'use client';

import { useEffect, useState } from 'react';
import type { Surah, SurahSummary, Ayah } from '@/lib/quran-data';
import { getSurah, getSurahs } from '@/lib/quran-api';
import { SurahView } from './surah-view';
import { RightSidebar } from './right-sidebar';
import { Header } from '@/components/layout/header';

export function QuranBrowser() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahSummary, setSelectedSurahSummary] = useState<SurahSummary | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const surahList = await getSurahs();
        setSurahs(surahList);
        if (surahList.length > 0) {
          handleSelectSurah(surahList[0]);
        }
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setIsLoadingSurahs(false);
      }
    }
    fetchSurahs();
  }, []);

  const handleSelectSurah = async (surahSummary: SurahSummary) => {
    if (selectedSurahSummary?.number === surahSummary.number) return;

    setIsLoadingSurah(true);
    setSelectedSurahSummary(surahSummary);
    setSelectedSurah(null);
    try {
      const surahDetail = await getSurah(surahSummary.number);
      setSelectedSurah(surahDetail);
    } catch (error) {
      console.error(`Failed to fetch surah ${surahSummary.number}:`, error);
    } finally {
      setIsLoadingSurah(false);
    }
  };

  const handleAddToNotes = (verse: Ayah) => {
    const verseReference = `Surah ${selectedSurah?.name.transliteration.en} (${selectedSurah?.number}:${verse.number.inSurah})\n`;
    const arabicText = `${verse.text.arab}\n`;
    const englishTranslation = `"${verse.translation.en}"\n\n`;
    const noteText = `${verseReference}${arabicText}${englishTranslation}`;
    
    setNotes(prevNotes => prevNotes ? `${prevNotes}${noteText}` : noteText);
  };

  return (
    <div className="flex h-screen w-full">
        <main className="flex flex-1 flex-col">
            <Header 
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
                    />
                </div>
                <RightSidebar 
                    surah={selectedSurah}
                    notes={notes}
                    onNotesChange={setNotes}
                />
            </div>
        </main>
    </div>
  );
}
