'use client';

import { useState } from 'react';
import { QuranSearch } from '@/components/search/quran-search';
import { HadithSearch } from '@/components/search/hadith-search';
import { MainHeader } from '@/components/layout/main-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideReact from 'lucide-react';
const { Search, BookOpen, FileText } = LucideReact as any;
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('quran');
  const router = useRouter();

  const handleQuranSelect = (surahNumber: number, ayahNumber: number) => {
    // Navigate to the specific verse in Quran browser
    router.push(`/quran/${surahNumber}#ayah-${ayahNumber}`);
  };

  const handleHadithSelect = (collectionId: string, hadithNumber: number) => {
    // Navigate to the specific hadith
    router.push(`/hadith/${collectionId}#hadith-${hadithNumber}`);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <MainHeader />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Pencarian Al-Quran dan Hadis</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Cari ayat Al-Quran dan hadis Nabi Muhammad ﷺ
        </p>
      </div>

      {/* Search Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="quran" 
            className="flex items-center gap-2 text-base font-medium"
          >
            <BookOpen className="h-4 w-4" />
            Al-Quran
          </TabsTrigger>
          <TabsTrigger 
            value="hadith" 
            className="flex items-center gap-2 text-base font-medium"
          >
            <FileText className="h-4 w-4" />
            Hadis
          </TabsTrigger>
        </TabsList>

        {/* Quran Search Tab */}
        <TabsContent value="quran" className="space-y-6">
          <QuranSearch 
            onVerseSelect={handleQuranSelect}
            className="w-full"
          />
        </TabsContent>

        {/* Hadith Search Tab */}
        <TabsContent value="hadith" className="space-y-6">
          <HadithSearch 
            onHadithSelect={handleHadithSelect}
            className="w-full"
          />
        </TabsContent>
      </Tabs>

      {/* Search Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-center">
            Tips Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Pencarian Al-Quran:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gunakan kata kunci dalam bahasa Arab untuk hasil terbaik</li>
                <li>• Anda dapat mencari dalam teks Arab atau terjemahan</li>
                <li>• Coba kata-kata yang berbeda jika tidak menemukan yang dicari</li>
                <li>• Hasil menampilkan nomor surah dan ayat</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Pencarian Hadis:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cari dalam matan hadis atau terjemahan</li>
                <li>• Gunakan kata seperti "Nabi", "Rasulullah", "berkata"</li>
                <li>• Hasil mencakup nama koleksi dan perawi</li>
                <li>• Anda dapat langsung ke hadis lengkap</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  );
}