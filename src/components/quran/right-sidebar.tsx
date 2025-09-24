
'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { Surah } from '@/lib/quran-data';
  
  interface RightSidebarProps {
    surah: Surah | null;
  }
  
  export function RightSidebar({ surah }: RightSidebarProps) {
    return (
      <Sidebar side="right" collapsible="offcanvas" className="border-l p-0 w-[350px]">
        <SidebarHeader>
          <h2 className="font-headline text-xl font-semibold">My Notes</h2>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {surah ? (
            <Card className="shadow-none border-0">
              <CardContent className="p-0">
                <Textarea
                  placeholder={`Jot down your reflections on ${surah.name.transliteration.en}...`}
                  className="h-96"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
              <p>Select a surah to start taking notes.</p>
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    );
  }
