
'use client';

import { useState } from 'react';
import { surahs } from '@/lib/quran-data';
import type { Surah } from '@/lib/quran-data';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SurahList } from './surah-list';
import { SurahView } from './surah-view';
import { Header } from '../layout/header';

export function QuranBrowser() {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(surahs[0]);

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r p-0" collapsible="icon">
        <SurahList
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSelectSurah={setSelectedSurah}
        />
      </Sidebar>
      <SidebarInset className="p-0 m-0 rounded-none shadow-none bg-transparent">
        <SurahView surah={selectedSurah} />
      </SidebarInset>
    </SidebarProvider>
  );
}
