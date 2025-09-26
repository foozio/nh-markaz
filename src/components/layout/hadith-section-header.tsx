'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HadithCollectionSummary } from '@/lib/hadith-api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HadithSectionHeaderProps {
  collections?: HadithCollectionSummary[];
  selectedCollection?: string;
  isLoading?: boolean;
}

export function HadithSectionHeader({
  collections = [],
  selectedCollection,
  isLoading = false,
}: HadithSectionHeaderProps) {
  const pathname = usePathname();
  const isCollectionPage = pathname?.includes('/hadith/') && pathname !== '/hadith';

  return (
    <div className="border-b bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-lg font-semibold">Koleksi Hadith</h2>
          <p className="text-sm text-muted-foreground">
            {isCollectionPage 
              ? 'Baca hadith dari koleksi yang dipilih'
              : 'Pilih koleksi hadith untuk mulai membaca'
            }
          </p>
        </div>
        
        {isCollectionPage ? (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/hadith">← Kembali ke Koleksi</Link>
            </Button>
            {selectedCollection && (
              <div className="text-sm font-medium text-muted-foreground">
                Koleksi: {selectedCollection}
              </div>
            )}
          </div>
        ) : (
          <div className="w-64">
            <Select disabled={isLoading || collections.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? 'Memuat Koleksi...' : 'Pilih dari daftar di bawah'} />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name} ({collection.available} hadith)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}