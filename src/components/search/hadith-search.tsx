'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchInput } from './search-input';
import { SearchResults, SearchResult } from './search-results';
// Removed direct import of cached-api to avoid client-side SQLite issues
import type { HadithCollectionSummary, HadithEntry, HadithCollectionDetail } from '@/lib/hadith-api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideReact from 'lucide-react';
const { File } = LucideReact as any;

interface HadithSearchProps {
  onHadithSelect?: (collectionId: string, hadithNumber: number) => void;
  className?: string;
}

export function HadithSearch({ onHadithSelect, className }: HadithSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<HadithCollectionSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const RESULTS_PER_PAGE = 10;

  // Load collections on component mount
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await fetch('/api/hadith/collections');
        if (!response.ok) {
          throw new Error('Failed to load hadith collections');
        }
        const data = await response.json();
        setCollections(data.collections || []);
      } catch (error) {
        console.error('Error loading hadith collections:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat koleksi hadis',
          variant: 'destructive'
        });
      }
    };

    loadCollections();
  }, [toast]);

  // Generate search suggestions based on common Arabic words in Hadith
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    
    const commonWords = [
      'الله', 'رسول', 'النبي', 'صلى الله عليه وسلم', 'قال',
      'الصلاة', 'الزكاة', 'الصوم', 'الحج', 'الجهاد',
      'الإيمان', 'الإسلام', 'الإحسان', 'التقوى', 'الصبر',
      'العدل', 'الرحمة', 'المغفرة', 'التوبة', 'الدعاء'
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
      const response = await fetch(`/api/search/hadith?q=${encodeURIComponent(query)}&cache=true`);
      
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
        const collectionInfo = collections.find(c => c.id === result.collectionId);
        
        // Generate highlights from search query
        const highlights: string[] = [];
        const searchTerm = query.toLowerCase().trim();
        
        if (result.arabicText.toLowerCase().includes(searchTerm)) {
          const arabicWords = result.arabicText.split(' ');
          arabicWords.forEach((word: string) => {
            if (word.toLowerCase().includes(searchTerm)) {
              highlights.push(word);
            }
          });
        }
        
        return {
          id: `${result.collectionId}-${result.hadithNumber}`,
          type: 'hadith' as const,
          arabicText: result.arabicText || '',
          translation: result.translation || '',
          highlights,
          matchScore: 0.8, // Default match score
          hadithId: result.hadithNumber,
          collection: collectionInfo?.name || result.collectionId,
          narrator: result.narrator || '', // Use actual narrator from data
          grade: result.grade || 'Sahih' // Use actual grade from data
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
    if (result.hadithId) {
      // Find the collection ID from the result ID
      const collectionId = result.id.split('-')[0];
      onHadithSelect?.(collectionId, result.hadithId);
    }
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5 text-primary" />
            Pencarian Hadis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Cari hadis Nabi Muhammad ﷺ..."
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