'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchInput } from './search-input';
import { SearchResults, SearchResult } from './search-results';
import { getSurahs, getSurah } from '@/lib/quran-api';
import type { SurahSummary, Surah, Ayah } from '@/lib/quran-data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface QuranSearchProps {
  onVerseSelect?: (surahNumber: number, verseNumber: number) => void;
  className?: string;
}

export function QuranSearch({ onVerseSelect, className }: QuranSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [surahs, setSurahs] = useState<SurahSummary[]>([]);
  const [allVerses, setAllVerses] = useState<(Ayah & { surahInfo: SurahSummary })[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const RESULTS_PER_PAGE = 10;

  // Load surahs on component mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await getSurahs();
        setSurahs(surahsData);
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

  // Search function
  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    setCurrentPage(page);

    try {
      // If we don't have all verses loaded, load them
      if (allVerses.length === 0) {
        const allVersesData: (Ayah & { surahInfo: SurahSummary })[] = [];
        
        for (const surahSummary of surahs) {
          try {
            const surah = await getSurah(surahSummary.number);
            surah.verses.forEach(verse => {
              allVersesData.push({
                ...verse,
                surahInfo: surahSummary
              });
            });
          } catch (error) {
            console.error(`Error loading surah ${surahSummary.number}:`, error);
          }
        }
        
        setAllVerses(allVersesData);
      }

      // Search through verses
      const searchTerm = query.toLowerCase().trim();
      const matchingVerses = (allVerses.length > 0 ? allVerses : []).filter(verse => {
        const arabicText = verse.text.arab.toLowerCase();
        const translationEn = verse.translation.en.toLowerCase();
        const translationId = verse.translation.id.toLowerCase();
        const transliteration = verse.text.transliteration.en.toLowerCase();
        
        return arabicText.includes(searchTerm) ||
               translationEn.includes(searchTerm) ||
               translationId.includes(searchTerm) ||
               transliteration.includes(searchTerm);
      });

      // Calculate pagination
      const startIndex = (page - 1) * RESULTS_PER_PAGE;
      const endIndex = startIndex + RESULTS_PER_PAGE;
      const paginatedResults = matchingVerses.slice(startIndex, endIndex);

      // Convert to SearchResult format
      const results: SearchResult[] = paginatedResults.map(verse => {
        const highlights = [];
        
        // Find highlighted words
        if (verse.text.arab.toLowerCase().includes(searchTerm)) {
          // Extract Arabic words that match
          const arabicWords = verse.text.arab.split(' ');
          arabicWords.forEach(word => {
            if (word.toLowerCase().includes(searchTerm)) {
              highlights.push(word);
            }
          });
        }

        // Calculate match score based on relevance
        let matchScore = 0.5;
        if (verse.text.arab.toLowerCase().includes(searchTerm)) matchScore += 0.3;
        if (verse.translation.id.toLowerCase().includes(searchTerm)) matchScore += 0.2;
        
        return {
          id: `${verse.surahInfo.number}-${verse.number.inSurah}`,
          type: 'quran' as const,
          arabicText: verse.text.arab,
          translation: verse.translation.id,
          highlights,
          matchScore: Math.min(matchScore, 1),
          surahId: verse.surahInfo.number,
          surahName: verse.surahInfo.name.transliteration.en,
          ayahNumber: verse.number.inSurah
        };
      });

      setSearchResults(results);
      setTotalResults(matchingVerses.length);
      
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
    if (result.surahId && result.ayahNumber) {
      onVerseSelect?.(result.surahId, result.ayahNumber);
    }
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
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