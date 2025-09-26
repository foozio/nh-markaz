
import { LandingHeader } from '@/components/layout/landing-header';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'quran-page');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-[60vh] w-full">
            {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Selamat Datang di Markaz
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
                        Mitra Belajar Quran dan Hadith Anda
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button asChild size="lg">
                            <Link href="/login">Mulai Sekarang</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Fitur Unggulan Kami
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Semua yang Anda butuhkan untuk pengalaman membaca Quran dan Hadith yang mendalam.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                    <div className="flex flex-col items-center gap-y-4 rounded-xl bg-card p-8 shadow-sm">
                        <CheckCircle className="h-10 w-10 text-primary" />
                        <h3 className="text-lg font-semibold leading-7 text-card-foreground">Bacaan Quran Lengkap</h3>
                        <p className="text-center text-sm leading-6 text-card-foreground/80">
                            Akses 114 surah dengan terjemahan Bahasa Indonesia dan audio murottal yang jernih.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-y-4 rounded-xl bg-card p-8 shadow-sm">
                        <CheckCircle className="h-10 w-10 text-primary" />
                        <h3 className="text-lg font-semibold leading-7 text-card-foreground">Koleksi Hadith</h3>
                        <p className="text-center text-sm leading-6 text-card-foreground/80">
                            Jelajahi berbagai koleksi hadith shahih dari sumber terpercaya untuk memperdalam pemahaman.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-y-4 rounded-xl bg-card p-8 shadow-sm">
                        <CheckCircle className="h-10 w-10 text-primary" />
                        <h3 className="text-lg font-semibold leading-7 text-card-foreground">Ringkasan AI</h3>
                        <p className="text-center text-sm leading-6 text-card-foreground/80">
                            Dapatkan pemahaman mendalam tentang setiap ayat dan hadith dengan ringkasan yang dihasilkan oleh AI.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-y-4 rounded-xl bg-card p-8 shadow-sm">
                        <CheckCircle className="h-10 w-10 text-primary" />
                        <h3 className="text-lg font-semibold leading-7 text-card-foreground">Catatan & Penanda</h3>
                        <p className="text-center text-sm leading-6 text-card-foreground/80">
                            Simpan refleksi pribadi Anda dan tandai ayat-ayat penting untuk referensi di masa depan.
                        </p>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Markaz. Dibuat dengan ❤️ untuk kemaslahatan umat.
        </div>
      </footer>
    </div>
  );
}
