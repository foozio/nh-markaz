'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchInput } from './search-input';
import { SearchResults, SearchResult } from './search-results';
// Removed direct import of cached-api to avoid client-side SQLite issues
import type { SurahSummary, Surah, Ayah } from '@/lib/quran-data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideReact from 'lucide-react';
const { Book } = LucideReact as any;

interface QuranSearchProps {
  onVerseSelect?: (surahNumber: number, verseNumber: number) => void;
  className?: string;
}

export function QuranSearch({ onVerseSelect, className }: QuranSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const RESULTS_PER_PAGE = 10;

  // Load surahs on component mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const response = await fetch('/api/surahs');
        if (!response.ok) {
          throw new Error('Failed to load surahs');
        }
        const data = await response.json();
        setSurahs(data.surahs || []);
      } catch (error) {
        console.error('Error loading surahs:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat daftar surah',
          variant: 'destructive'
        });
      }
    };

    loadSurahs();
  }, [toast]);

  // Generate search suggestions based on common Arabic words
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const commonWords = [
      'الله', 'الرحمن', 'الرحيم', 'رب', 'العالمين',
      'الصلاة', 'الزكاة', 'الصوم', 'الحج', 'الجنة',
      'النار', 'الكتاب', 'الحكمة', 'الهدى', 'النور',
      'الإيمان', 'التقوى', 'الصبر', 'الشكر', 'التوبة'
    ];
    
    return commonWords.filter(word => 
      word.includes(searchQuery) || searchQuery.includes(word)
    ).slice(0, 5);
  }, [searchQuery]);

  // Search function using cached API
  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    setCurrentPage(page);

    try {
      // Use API route for search
      const response = await fetch(`/api/search/quran?q=${encodeURIComponent(query)}&cache=true`);
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data = await response.json();
      const cachedResults = data.results || [];
      
      // Calculate pagination
      const startIndex = (page - 1) * RESULTS_PER_PAGE;
      const endIndex = startIndex + RESULTS_PER_PAGE;
      const paginatedResults = cachedResults.slice(startIndex, endIndex);

      // Convert cached results to SearchResult format
      const results: SearchResult[] = paginatedResults.map((result: any, index: number) => {
        // Fix: Use correct field names from API response
        const surahNumber = result.surahId || result.surahNumber;
        const verseNumber = result.ayahNumber || result.verseNumber;
        const surahInfo = surahs.find(s => s.number === surahNumber);
        
        // Generate highlights from search query
        const highlights: string[] = [];
        const searchTerm = query.toLowerCase().trim();
        
        if (result.arabicText && result.arabicText.toLowerCase().includes(searchTerm)) {
          const arabicWords = result.arabicText.split(' ');
          arabicWords.forEach((word: string) => {
            if (word.toLowerCase().includes(searchTerm)) {
              highlights.push(word);
            }
          });
        }
        
        return {
          id: `${surahNumber}-${verseNumber}`,
          type: 'quran' as const,
          arabicText: result.arabicText || '',
          translation: result.translation || '',
          transliteration: result.transliteration || '',
          highlights,
          matchScore: 0.8, // Default match score
          surahNumber: surahNumber,
          surahName: surahInfo?.name.transliteration.en || `Surah ${surahNumber}`,
          verseNumber: verseNumber,
          juz: result.juz || 1,
          page: result.page || 1
        };
      });

      setSearchResults(results);
      setTotalResults(cachedResults.length);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error Pencarian',
        description: 'Terjadi kesalahan saat mencari, silakan coba lagi',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query, 1);
  };

  const handlePageChange = (page: number) => {
    performSearch(searchQuery, page);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.surahNumber && result.verseNumber) {
      onVerseSelect?.(result.surahNumber, result.verseNumber);
    }
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Pencarian Al-Quran
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Cari ayat Al-Quran..."
            isLoading={isLoading}
            suggestions={searchSuggestions}
            onSuggestionSelect={handleSearch}
          />
          
          {searchQuery && (
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              totalCount={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onResultClick={handleResultClick}
              searchQuery={searchQuery}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}