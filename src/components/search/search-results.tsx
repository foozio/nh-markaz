'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideReact from 'lucide-react';
const { Book, File, ChevronLeft, ChevronRight } = LucideReact as any;
import { cn } from '@/lib/utils';

export interface SearchResult {
  id: string;
  type: 'quran' | 'hadith';
  arabicText: string;
  translation: string;
  highlights: string[];
  matchScore: number;
  // Quran specific
  surahId?: number;
  surahNumber?: number;
  surahName?: string;
  ayahNumber?: number;
  verseNumber?: number;
  // Hadith specific
  hadithId?: number;
  collection?: string;
  narrator?: string;
  grade?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onResultClick?: (result: SearchResult) => void;
  searchQuery?: string;
}

export function SearchResults({
  results,
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onResultClick,
  searchQuery = ''
}: SearchResultsProps) {
  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length || !searchQuery) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-accent text-accent-foreground px-1 rounded">$1</mark>'
      );
    });
    
    return highlightedText;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
          <File className="h-full w-full" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Tidak Ada Hasil</h3>
        <p className="text-muted-foreground">Tidak ditemukan hasil untuk pencarian yang diminta</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {results.length} dari {totalCount} hasil
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Halaman {currentPage} dari {totalPages}
          </Badge>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <Card 
            key={result.id} 
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onResultClick?.(result)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.type === 'quran' ? (
                      <Book className="h-4 w-4 text-primary" />
                    ) : (
                      <File className="h-4 w-4 text-primary" />
                    )}
                    <Badge variant="outline" className="font-medium">
                      {result.type === 'quran' 
                        ? `${result.surahName} - Ayat ${result.ayahNumber || result.verseNumber}`
                        : `${result.collection} - Hadith ${result.hadithId}`
                      }
                    </Badge>
                    {result.grade && (
                      <Badge 
                        variant={result.grade === 'صحيح' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {result.grade}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(result.matchScore * 100)}% cocok
                  </div>
                </div>

                {/* Arabic Text */}
                <div 
                  className="text-lg font-naskh leading-relaxed text-right group-hover:text-primary transition-colors"
                  dir="rtl"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(result.arabicText, result.highlights)
                  }}
                />

                {/* Translation */}
                <div className="text-sm text-muted-foreground leading-relaxed border-t pt-3">
                  {result.translation}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            Sebelumnya
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="gap-1"
          >
            Berikutnya
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}