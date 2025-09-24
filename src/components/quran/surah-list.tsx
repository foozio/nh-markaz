
'use client';

import type { Surah } from '@/lib/quran-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BookMarked } from 'lucide-react';

interface SurahListProps {
  surahs: Surah[];
  selectedSurah: Surah | null;
  onSelectSurah: (surah: Surah) => void;
}

export function SurahList({
  surahs,
  selectedSurah,
  onSelectSurah,
}: SurahListProps) {
  return (
    <>
      <SidebarHeader>
        <h2 className="font-headline text-xl font-semibold">Surahs</h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <ScrollArea className="h-full">
          <SidebarMenu>
            {surahs.map((surah) => (
              <SidebarMenuItem key={surah.id}>
                <SidebarMenuButton
                  onClick={() => onSelectSurah(surah)}
                  isActive={selectedSurah?.id === surah.id}
                  className="justify-between"
                  tooltip={{
                    children: (
                      <div className="text-left">
                        <p className="font-bold">{surah.transliteration}</p>
                        <p className="text-xs text-muted-foreground">{surah.translation}</p>
                      </div>
                    ),
                    className: "w-40"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {surah.id}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {surah.transliteration}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {surah.translation}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm">{surah.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </>
  );
}
