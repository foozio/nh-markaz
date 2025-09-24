
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
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bookmark, PlayCircle, Share2, Sparkles, Loader2, FilePlus } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface VerseItemProps {
  verse: Ayah;
  surahId: number;
  onAddToNotes: () => void;
  onAddSummaryToNotes: (summary: string) => void;
}

export function VerseItem({ verse, surahId, onAddToNotes, onAddSummaryToNotes }: VerseItemProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    setIsDialogOpen(true);
    const result = await getVerseSummary(verse.translation.id);
    if (result.summary) {
      setSummary(result.summary);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Terjadi kesalahan yang tidak diketahui.',
      });
      setIsDialogOpen(false);
    }
    setIsLoading(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Penanda dihapus' : 'Penanda ditambahkan',
      description: `Ayat ${surahId}:${verse.number.inSurah} telah ${
        isBookmarked ? 'dihapus dari' : 'ditambahkan ke'
      } penanda Anda.`,
    });
  };

  const handlePlayAudio = () => {
    toast({
        title: "Memutar Audio",
        description: `Murottal untuk ayat ${surahId}:${verse.number.inSurah}.`
    });
    try {
      const sound = new Audio(verse.audio.primary);
      sound.play();
    } catch (e) {
      console.error("Gagal memutar audio", e);
      toast({
        variant: 'destructive',
        title: 'Kesalahan Audio',
        description: 'Tidak dapat memutar audio untuk ayat ini.'
      })
    }
  }

  const handleAddToNotesClick = () => {
    onAddToNotes();
    toast({
      title: 'Ayat Ditambahkan',
      description: `Ayat ${surahId}:${verse.number.inSurah} telah ditambahkan ke catatan Anda.`,
    });
  }

  const handleAddSummaryClick = () => {
    if (summary) {
      onAddSummaryToNotes(summary);
      setIsDialogOpen(false);
      toast({
        title: 'Ringkasan Ditambahkan',
        description: `Ringkasan AI untuk ayat ${surahId}:${verse.number.inSurah} telah ditambahkan ke catatan Anda.`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-bold text-primary">{`${surahId}:${verse.number.inSurah}`}</span>
        <p dir="rtl" className="flex-1 text-right font-quran text-3xl leading-relaxed text-foreground">
          {verse.text.arab}
        </p>
      </div>

      <div className="space-y-4 text-muted-foreground">
        <div className="space-y-2">
            <p className="text-lg italic text-foreground/80 leading-loose">{verse.translation.id}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handlePlayAudio} aria-label="Putar audio">
          <PlayCircle className="h-5 w-5 text-primary/80" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleBookmark} aria-label="Tandai ayat">
          <Bookmark className={`h-5 w-5 text-primary/80 transition-colors ${isBookmarked ? 'fill-accent text-accent' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSummarize} aria-label="Ringkas dengan AI">
          <Sparkles className="h-5 w-5 text-accent" />
        </Button>
         <Button variant="ghost" size="icon" aria-label="Bagikan ayat">
          <Share2 className="h-5 w-5 text-primary/80" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleAddToNotesClick} aria-label="Tambah ke catatan">
          <FilePlus className="h-5 w-5 text-primary/80" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Ringkasan AI</DialogTitle>
            <DialogDescription>
              Penjelasan singkat tentang ayat {`${surahId}:${verse.number.inSurah}`}.
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="space-y-4 py-4">
                <div className='flex justify-center items-center gap-2'>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className='text-muted-foreground'>Menghasilkan ringkasan...</p>
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
           <DialogFooter>
            <Button variant="ghost" size="icon" onClick={handleAddSummaryClick} aria-label="Tambah ringkasan ke catatan" disabled={isLoading || !summary}>
              <FilePlus className="h-5 w-5 text-primary/80" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
