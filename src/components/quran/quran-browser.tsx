
'use client';

import { useEffect, useState } from 'react';
import type { Surah, SurahSummary } from '@/lib/quran-data';
import { getSurah, getSurahs } from '@/lib/quran-api';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SurahList } from './surah-list';
import { SurahView } from './surah-view';
import { Skeleton } from '../ui/skeleton';

export function QuranBrowser() {
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedSurahSummary, setSelectedSurahSummary] = useState<SurahSummary | null>(null);
  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingSurah, setIsLoadingSurah] = useState(false);

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

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r p-0" collapsible="icon">
        {isLoadingSurahs ? (
            <div className="p-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ) : (
            <SurahList
              surahs={surahs}
              selectedSurah={selectedSurahSummary}
              onSelectSurah={handleSelectSurah}
            />
        )}
      </Sidebar>
      <SidebarInset className="p-0 m-0 rounded-none shadow-none bg-transparent">
        <SurahView surah={selectedSurah} isLoading={isLoadingSurah} />
      </SidebarInset>
    </SidebarProvider>
  );
}
