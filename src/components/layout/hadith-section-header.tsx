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
    <div className="border-b bg-gradient-to-r from-background/95 to-background/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Koleksi Hadith
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {isCollectionPage 
              ? 'Baca hadith dari koleksi yang dipilih'
              : 'Pilih koleksi hadith untuk mulai membaca'
            }
          </p>
        </div>
        
        {isCollectionPage ? (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-2 border-border/50 hover:border-primary/50 transition-colors duration-200 bg-background/50 backdrop-blur font-medium"
            >
              <Link href="/hadith">← Kembali ke Koleksi</Link>
            </Button>
            {selectedCollection && (
              <div className="text-sm font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md border border-border/30">
                Koleksi: {selectedCollection}
              </div>
            )}
          </div>
        ) : (
          <div className="w-72">
            <Select disabled={isLoading || collections.length === 0}>
              <SelectTrigger className="h-11 border-2 border-border/50 hover:border-primary/50 transition-colors duration-200 bg-background/50 backdrop-blur">
                <SelectValue placeholder={isLoading ? 'Memuat Koleksi...' : 'Pilih dari daftar di bawah'} />
              </SelectTrigger>
              <SelectContent className="max-h-[350px] border-2 border-border/50 bg-background/95 backdrop-blur">
                {collections.map((collection) => (
                  <SelectItem 
                    key={collection.id} 
                    value={collection.id}
                    className="hover:bg-primary/10 transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-foreground">
                        {collection.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-3 font-medium">
                        ({collection.available} hadith)
                      </span>
                    </div>
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