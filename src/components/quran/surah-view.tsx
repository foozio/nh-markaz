
'use client';

import type { Surah } from '@/lib/quran-data';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

interface SurahViewProps {
  surah: Surah | null;
}

export function SurahView({ surah }: SurahViewProps) {
  const quranPageImage = PlaceHolderImages.find((img) => img.id === 'quran-page');

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
      <div className="grid flex-shrink-0 gap-6 border-b p-4 md:grid-cols-2 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-2">
            <h2 className="font-headline text-2xl font-bold tracking-tight">
              {surah.transliteration} - {surah.translation}
            </h2>
            <p className="text-muted-foreground">{surah.total_verses} verses</p>
        </div>
        <div className="flex items-center justify-end">
            <h1 dir="rtl" className="font-headline text-3xl font-bold text-primary">
                {surah.name}
            </h1>
        </div>
      </div>

      <div className="grid flex-1 overflow-hidden md:grid-cols-2">
        <ScrollArea className="h-full">
            <div className="p-4 lg:p-6 space-y-4">
                <Card className="overflow-hidden shadow-lg">
                    {quranPageImage && (
                        <Image
                            src={quranPageImage.imageUrl}
                            alt={quranPageImage.description}
                            width={800}
                            height={1200}
                            className="w-full object-cover"
                            data-ai-hint={quranPageImage.imageHint}
                        />
                    )}
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className='font-headline'>My Notes</CardTitle>
                        <CardDescription>Jot down your reflections on {surah.transliteration}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea placeholder="Type your notes here..." className="h-48" />
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        <ScrollArea className="h-full border-l">
            <div className="p-4 lg:p-6">
                <div className="space-y-4">
                    {surah.verses.map((verse, index) => (
                        <div key={verse.id}>
                            <VerseItem verse={verse} surahId={surah.id} />
                            {index < surah.verses.length - 1 && <Separator className="my-6" />}
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
