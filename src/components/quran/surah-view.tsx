
'use client';

import type { Surah } from '@/lib/quran-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { VerseItem } from './verse-item';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SurahViewProps {
  surah: Surah | null;
  isLoading: boolean;
}

export function SurahView({ surah, isLoading }: SurahViewProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-2xl font-bold font-headline">Loading Surah...</h2>
            <p className="text-muted-foreground">Please wait a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/40">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-headline">Select a Surah</h2>
          <p className="text-muted-foreground">
            Choose a Surah from the list to begin reading.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-auto flex-shrink-0 items-center justify-between gap-6 border-b p-4 lg:p-6">
        <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              {surah.name.transliteration.en} - {surah.name.translation.en}
            </h2>
            <p className="text-muted-foreground">{surah.numberOfVerses} verses</p>
        </div>
        <div className="flex items-center justify-end">
            <h1 dir="rtl" className="font-headline text-3xl font-bold text-primary">
                {surah.name.long}
            </h1>
        </div>
      </div>

      <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6">
              <div className="space-y-4">
                  {surah.verses.map((verse, index) => (
                      <div key={verse.number.inQuran}>
                          <VerseItem verse={verse} surahId={surah.number} />
                          {index < surah.verses.length - 1 && <Separator className="my-6" />}
                      </div>
                  ))}
              </div>
          </div>
      </ScrollArea>
      <div className="flex-shrink-0 border-t">
          <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="notes" className="border-b-0">
                  <AccordionTrigger className="p-4 lg:p-6 font-headline text-lg">My Notes</AccordionTrigger>
                  <AccordionContent>
                      <div className="px-4 lg:px-6 pb-4">
                          <Card className="shadow-none border-0">
                              <CardContent className="p-0">
                                  <Textarea placeholder={`Jot down your reflections on ${surah.name.transliteration.en}...`} className="h-48" />
                              </CardContent>
                          </Card>
                      </div>
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
      </div>
    </div>
  );
}
