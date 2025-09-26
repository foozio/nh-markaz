import { getHadithCollections, getCompleteHadithCollection } from '@/lib/hadith-api';
import Link from 'next/link';
import { HadithReader } from '@/components/hadith/hadith-reader';
import { MainHeader } from '@/components/layout/main-header';
import { HadithSectionHeader } from '@/components/layout/hadith-section-header';

interface HadithCollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export default async function HadithCollectionPage({ params }: HadithCollectionPageProps) {
  const { collection } = await params;
  const collections = await getHadithCollections();
  const selectedCollection = collections.find(item => item.id === collection);

  if (!selectedCollection) {
    throw new Error('Koleksi hadith tidak ditemukan.');
  }

  const detail = await getCompleteHadithCollection(collection, selectedCollection.available);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1">
        <HadithSectionHeader selectedCollection={detail.name} />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <HadithReader
            collectionId={collection}
            collectionName={detail.name}
            hadiths={detail.hadiths}
          />

          <footer className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p>Sumber data: <a className="text-primary hover:underline" href="https://api.hadith.gading.dev" target="_blank" rel="noreferrer">api.hadith.gading.dev</a>. Kami akan menambahkan navigasi lanjutan dan pencarian hadith pada iterasi berikutnya.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
