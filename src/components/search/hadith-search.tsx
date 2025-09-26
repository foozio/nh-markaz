'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchInput } from './search-input';
import { SearchResults, SearchResult } from './search-results';
import { getHadithCollections, getHadiths } from '@/lib/hadith-api';
import type { HadithCollectionSummary, HadithEntry, HadithCollectionDetail } from '@/lib/hadith-api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface HadithSearchProps {
  onHadithSelect?: (collectionId: string, hadithNumber: number) => void;
  className?: string;
}

export function HadithSearch({ onHadithSelect, className }: HadithSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<HadithCollectionSummary[]>([]);
  const [allHadiths, setAllHadiths] = useState<(HadithEntry & { collectionInfo: HadithCollectionSummary })[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const RESULTS_PER_PAGE = 10;

  // Load collections on component mount
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const collectionsData = await getHadithCollections();
        setCollections(collectionsData);
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

  // Load hadiths from all collections (with pagination to avoid overwhelming the API)
  const loadAllHadiths = async () => {
    const allHadithsData: (HadithEntry & { collectionInfo: HadithCollectionSummary })[] = [];
    
    // Load a sample from each collection (first 50 hadiths)
    for (const collection of collections) {
      try {
        const hadithData = await getHadiths(collection.id, '1-50');
        hadithData.hadiths.forEach(hadith => {
          allHadithsData.push({
            ...hadith,
            collectionInfo: collection
          });
        });
      } catch (error) {
        console.error(`Error loading hadiths from ${collection.name}:`, error);
      }
    }
    
    setAllHadiths(allHadithsData);
    return allHadithsData;
  };

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
      // Load hadiths if not already loaded
      let hadithsToSearch = allHadiths;
      if (hadithsToSearch.length === 0) {
        hadithsToSearch = await loadAllHadiths();
      }

      // Search through hadiths
      const searchTerm = query.toLowerCase().trim();
      const matchingHadiths = hadithsToSearch.filter(hadith => {
        const arabicText = hadith.arab.toLowerCase();
        const translationText = hadith.id.toLowerCase();
        
        return arabicText.includes(searchTerm) ||
               translationText.includes(searchTerm);
      });

      // Calculate pagination
      const startIndex = (page - 1) * RESULTS_PER_PAGE;
      const endIndex = startIndex + RESULTS_PER_PAGE;
      const paginatedResults = matchingHadiths.slice(startIndex, endIndex);

      // Convert to SearchResult format
      const results: SearchResult[] = paginatedResults.map(hadith => {
        const highlights = [];
        
        // Find highlighted words
        if (hadith.arab.toLowerCase().includes(searchTerm)) {
          // Extract Arabic words that match
          const arabicWords = hadith.arab.split(' ');
          arabicWords.forEach(word => {
            if (word.toLowerCase().includes(searchTerm)) {
              highlights.push(word);
            }
          });
        }

        // Calculate match score based on relevance
        let matchScore = 0.5;
        if (hadith.arab.toLowerCase().includes(searchTerm)) matchScore += 0.3;
        if (hadith.id.toLowerCase().includes(searchTerm)) matchScore += 0.2;
        
        return {
          id: `${hadith.collectionInfo.id}-${hadith.number}`,
          type: 'hadith' as const,
          arabicText: hadith.arab,
          translation: hadith.id,
          highlights,
          matchScore: Math.min(matchScore, 1),
          hadithId: hadith.number,
          collection: hadith.collectionInfo.name,
          narrator: 'Beragam', // Default narrator as API doesn't provide specific narrator info
          grade: 'Sahih' // Default grade
        };
      });

      setSearchResults(results);
      setTotalResults(matchingHadiths.length);
      
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
            <FileText className="h-5 w-5 text-primary" />
            Pencarian Hadis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Cari hadis Nabi Muhammad SAW..."
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