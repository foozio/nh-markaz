import { getHadiths } from '@/lib/hadith-api';
import Link from 'next/link';
import { HadithReader } from '@/components/hadith/hadith-reader';

interface HadithCollectionPageProps {
  params: {
    collection: string;
  };
  searchParams: {
    range?: string;
  };
}

const DEFAULT_RANGE = '1-5';

export default async function HadithCollectionPage({ params, searchParams }: HadithCollectionPageProps) {
  const range = searchParams.range || DEFAULT_RANGE;
  const detail = await getHadiths(params.collection, range);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <Link href="/hadith" className="text-sm text-primary hover:underline">&larr; Kembali ke daftar koleksi</Link>
        <div>
          <p className="font-semibold text-primary uppercase tracking-wide">Hadith</p>
          <h1 className="font-headline text-4xl">{detail.name}</h1>
          <p className="text-muted-foreground">Menampilkan {detail.requested} riwayat pertama. Koleksi lengkap mencakup sekitar {detail.available.toLocaleString('id-ID')} hadith.</p>
        </div>
      </header>

      <HadithReader
        collectionId={params.collection}
        collectionName={detail.name}
        range={range}
        hadiths={detail.hadiths}
      />

      <footer className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p>Sumber data: <a className="text-primary hover:underline" href="https://api.hadith.gading.dev" target="_blank" rel="noreferrer">api.hadith.gading.dev</a>. Kami akan menambahkan navigasi lanjutan dan pencarian hadith pada iterasi berikutnya.</p>
      </footer>
    </main>
  );
}
