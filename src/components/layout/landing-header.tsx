
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoonStarIcon } from './quran-header';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/" className="flex items-center gap-3">
        <MoonStarIcon className="h-6 w-6 text-primary" />
        <h1 className="font-headline text-2xl font-bold text-primary">
          Markaz
        </h1>
      </Link>
      <nav className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/login">Masuk</Link>
        </Button>
        <Button asChild>
          <Link href="/login">Daftar</Link>
        </Button>
      </nav>
    </header>
  );
}
