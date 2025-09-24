import { getHadithCollections } from '@/lib/hadith-api';
import Link from 'next/link';

export const metadata = {
  title: 'Hadith | Markaz',
};

export default async function HadithPage() {
  const collections = await getHadithCollections();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2 text-center">
        <p className="font-semibold text-primary">Fitur Hadith (Eksperimental)</p>
        <h1 className="font-headline text-4xl">Jelajahi Koleksi Hadith</h1>
        <p className="text-muted-foreground">
          Kami sedang menyiapkan pengalaman hadith terkurasi. Sementara waktu, berikut daftar koleksi
          yang tersedia dari API Hadith Gading.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {collections.map(collection => (
          <article key={collection.id} className="flex h-full flex-col justify-between rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="font-headline text-xl font-semibold">{collection.name}</h2>
            <p className="text-sm text-muted-foreground">
              Sekitar {collection.available.toLocaleString('id-ID')} riwayat tersedia.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>
                Telusuri hadith pertama dalam koleksi ini. Pencarian lanjutan dan fitur penyimpanan akan segera hadir.
              </p>
              <Link
                href={`/hadith/${collection.id}`}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Buka Koleksi
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
