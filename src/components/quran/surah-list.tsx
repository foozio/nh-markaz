
'use client';

import type { SurahSummary } from '@/lib/quran-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

interface SurahListProps {
  surahs: SurahSummary[];
  selectedSurah: SurahSummary | null;
  onSelectSurah: (surah: SurahSummary) => void;
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
              <SidebarMenuItem key={surah.number}>
                <SidebarMenuButton
                  onClick={() => onSelectSurah(surah)}
                  isActive={selectedSurah?.number === surah.number}
                  className="justify-between"
                  tooltip={{
                    children: (
                      <div className="text-left">
                        <p className="font-bold">{surah.name.transliteration.en}</p>
                        <p className="text-xs text-muted-foreground">{surah.name.translation.id}</p>
                      </div>
                    ),
                    className: "w-40"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {surah.number}
                    </span>
                    <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {surah.name.transliteration.en}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {surah.name.translation.id} • {surah.numberOfVerses || 0} ayat
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{surah.name.long.split('سُورَةُ ')[1] || surah.name.long}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </>
  );
}
