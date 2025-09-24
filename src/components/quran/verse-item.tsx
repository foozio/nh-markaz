
'use client';

import { useState } from 'react';
import type { Ayah } from '@/lib/quran-data';
import { getVerseSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, PlayCircle, Share2, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface VerseItemProps {
  verse: Ayah;
  surahId: number;
}

export function VerseItem({ verse, surahId }: VerseItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    setIsDialogOpen(true);
    const result = await getVerseSummary(verse.translations.en);
    if (result.summary) {
      setSummary(result.summary);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'An unknown error occurred.',
      });
      setIsDialogOpen(false);
    }
    setIsLoading(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      description: `Verse ${surahId}:${verse.id} has been ${
        isBookmarked ? 'removed from' : 'added to'
      } your bookmarks.`,
    });
  };

  const handlePlayAudio = () => {
    // Mock audio playback
    toast({
        title: "Playing Audio",
        description: `Recitation for verse ${surahId}:${verse.id}.`
    });
    // In a real app, you would use a library like howler.js
    // const sound = new Howl({ src: [verse.audio] });
    // sound.play();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-bold text-primary">{`${surahId}:${verse.id}`}</span>
        <p dir="rtl" className="flex-1 text-right font-headline text-3xl leading-relaxed text-foreground">
          {verse.text}
        </p>
      </div>

      <div className="space-y-4 text-muted-foreground">
        <div className="space-y-2">
            <p className="text-lg italic text-foreground/80 leading-loose">{verse.translations.en}</p>
            <p className="font-sans text-right leading-loose">{verse.translations.ur}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label="Play audio">
          <PlayCircle className="h-5 w-5 text-primary/80" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleBookmark} aria-label="Bookmark verse">
          <Bookmark className={`h-5 w-5 text-primary/80 transition-colors ${isBookmarked ? 'fill-accent text-accent' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSummarize} aria-label="Summarize with AI">
          <Sparkles className="h-5 w-5 text-accent" />
        </Button>
         <Button variant="ghost" size="icon" aria-label="Share verse">
          <Share2 className="h-5 w-5 text-primary/80" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">AI Summary</DialogTitle>
            <DialogDescription>
              A concise explanation of verse {`${surahId}:${verse.id}`}.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-4 py-4">
                <div className='flex justify-center items-center gap-2'>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className='text-muted-foreground'>Generating summary...</p>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
              <p>{summary}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
