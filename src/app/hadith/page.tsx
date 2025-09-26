import { getHadithCollections } from '@/lib/hadith-api';
import Link from 'next/link';
import { MainHeader } from '@/components/layout/main-header';
import { HadithSectionHeader } from '@/components/layout/hadith-section-header';

export const metadata = {
  title: 'Hadith | Markaz',
};

export default async function HadithPage() {
  const collections = await getHadithCollections();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MainHeader />
      <main className="flex-1">
        <HadithSectionHeader collections={collections} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/hadith/${collection.id}`}
                className="block rounded-lg border p-6 transition-colors hover:bg-accent"
              >
                <h2 className="font-headline text-xl font-semibold">{collection.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {collection.available} hadith tersedia
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
