'use client';

import { useParams } from 'next/navigation';
import { QuranBrowser } from '@/components/quran/quran-browser';

export default function QuranSurahPage() {
  const params = useParams();
  const surahNumber = params.surahNumber as string;

  return <QuranBrowser initialSurahNumber={parseInt(surahNumber)} />;
}