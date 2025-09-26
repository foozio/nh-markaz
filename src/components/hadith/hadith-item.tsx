'use client';

import { useState } from 'react';
import type { HadithEntry } from '@/lib/hadith-api';
import { getHadithSummary } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bookmark, Share2, Sparkles, FilePlus, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HadithItemProps {
  hadith: HadithEntry;
  collectionName: string;
  range?: string;
  isBookmarked: boolean;
  onToggleBookmark: (hadith: HadithEntry) => void;
  onAddToNotes: (hadith: HadithEntry) => void;
  onAddSummaryToNotes: (summary: string, hadith: HadithEntry) => void;
}

export function HadithItem({
  hadith,
  collectionName,
  range,
  isBookmarked,
  onToggleBookmark,
  onAddToNotes,
  onAddSummaryToNotes,
}: HadithItemProps) {
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleBookmark = () => {
    onToggleBookmark(hadith);
    toast({
      title: isBookmarked ? 'Penanda dihapus' : 'Penanda ditambahkan',
      description: `Hadith #${hadith.number} ${isBookmarked ? 'dihapus dari' : 'ditambahkan ke'} penanda Anda.`,
    });
  };

  const handleShare = async () => {
    const shareText = `Hadith #${hadith.number} (${collectionName})\n\n${hadith.arab}\n\n${hadith.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${collectionName} - Hadith #${hadith.number}`,
          text: hadith.id,
        });
        toast({ title: 'Bagikan', description: 'Hadith dibagikan melalui aplikasi pilihan Anda.' });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({ title: 'Tersalin', description: 'Hadith disalin ke clipboard.' });
      }
    } catch (error) {
      console.error('Gagal membagikan hadith:', error);
      toast({ variant: 'destructive', title: 'Gagal Membagikan', description: 'Tidak dapat membagikan hadith saat ini.' });
    }
  };

  const handleSummarize = async () => {
    setIsDialogOpen(true);
    setIsLoadingSummary(true);
    setSummary('');
    const payload = `${hadith.arab}\n\n${hadith.id}`;
    const result = await getHadithSummary(payload);
    if (result.summary) {
      setSummary(result.summary);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error ?? 'Terjadi kesalahan.' });
      setIsDialogOpen(false);
    }
    setIsLoadingSummary(false);
  };

  const handleAddToNotesClick = () => {
    onAddToNotes(hadith);
    toast({ title: 'Ditambahkan ke Catatan', description: `Hadith #${hadith.number} dimasukkan ke catatan.` });
  };

  const handleAddSummaryClick = () => {
    if (!summary) return;
    onAddSummaryToNotes(summary, hadith);
    setIsDialogOpen(false);
    toast({ title: 'Ringkasan Ditambahkan', description: `Ringkasan AI untuk hadith #${hadith.number} ditambahkan.` });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {range ? `Range ${range}` : 'Hadith'}
          </p>
          <h2 className="font-headline text-2xl">Hadith #{hadith.number}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBookmark} aria-label="Tandai hadith">
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-accent text-accent' : 'text-primary/80'}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSummarize} aria-label="Ringkas dengan AI">
            <Sparkles className="h-5 w-5 text-accent" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Bagikan hadith">
            <Share2 className="h-5 w-5 text-primary/80" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleAddToNotesClick} aria-label="Tambah ke catatan">
            <FilePlus className="h-5 w-5 text-primary/80" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-right font-naskh text-lg leading-relaxed" lang="ar" dir="rtl">
          {hadith.arab}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {hadith.id}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Ringkasan AI</DialogTitle>
            <DialogDescription>
              Penjelasan singkat untuk hadith #{hadith.number} dari koleksi {collectionName}.
            </DialogDescription>
          </DialogHeader>
          {isLoadingSummary ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-muted-foreground">Menghasilkan ringkasan...</p>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddSummaryClick}
              aria-label="Tambah ringkasan ke catatan"
              disabled={isLoadingSummary || !summary}
            >
              <FilePlus className="h-5 w-5 text-primary/80" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
