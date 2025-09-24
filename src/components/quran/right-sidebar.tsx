
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import type { Surah } from '@/lib/quran-data';
import { RichTextEditor } from './rich-text-editor';
  
  interface RightSidebarProps {
    surah: Surah | null;
    notes: string;
    onNotesChange: (notes: string) => void;
  }
  
  export function RightSidebar({ surah, notes, onNotesChange }: RightSidebarProps) {
    return (
      <aside className="w-[350px] border-l bg-background p-4 flex flex-col">
        <Card className="flex-1 flex flex-col shadow-none border-0">
          <CardHeader>
            <CardTitle className="font-headline text-xl font-semibold">My Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {surah ? (
                <RichTextEditor
                  content={notes}
                  onChange={onNotesChange}
                  placeholder={`Jot down your reflections on ${surah.name.transliteration.en}...`}
                />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground p-4">
                <p>Select a surah to start taking notes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    );
  }
