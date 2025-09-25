import { getHadithCollections, getCompleteHadithCollection } from '@/lib/hadith-api';
import Link from 'next/link';
import { HadithReader } from '@/components/hadith/hadith-reader';

interface HadithCollectionPageProps {
  params: {
    collection: string;
  };
}

export default async function HadithCollectionPage({ params }: HadithCollectionPageProps) {
  const collections = await getHadithCollections();
  const selectedCollection = collections.find(collection => collection.id === params.collection);

  if (!selectedCollection) {
    throw new Error('Koleksi hadith tidak ditemukan.');
  }

  const detail = await getCompleteHadithCollection(params.collection, selectedCollection.available);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <Link href="/hadith" className="text-sm text-primary hover:underline">&larr; Kembali ke daftar koleksi</Link>
        <div>
          <p className="font-semibold text-primary uppercase tracking-wide">Hadith</p>
          <h1 className="font-headline text-4xl">{detail.name}</h1>
          <p className="text-muted-foreground">Menampilkan seluruh {detail.available.toLocaleString('id-ID')} hadith dalam koleksi ini, dibagi per 10 riwayat.</p>
        </div>
      </header>

      <HadithReader
        collectionId={params.collection}
        collectionName={detail.name}
        hadiths={detail.hadiths}
      />

      <footer className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>Sumber data: <a className="text-primary hover:underline" href="https://api.hadith.gading.dev" target="_blank" rel="noreferrer">api.hadith.gading.dev</a>. Kami akan menambahkan navigasi lanjutan dan pencarian hadith pada iterasi berikutnya.</p>
      </footer>
    </main>
  );
}
