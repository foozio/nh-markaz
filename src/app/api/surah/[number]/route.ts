import { NextRequest, NextResponse } from 'next/server';
import { getSurah } from '@/lib/quran-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { number: string } }
) {
  try {
    const surahNumber = parseInt(params.number);
    
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { error: 'Invalid surah number' },
        { status: 400 }
      );
    }

    const surah = await getSurah(surahNumber);
    
    return NextResponse.json({
      success: true,
      surah
    });
  } catch (error) {
    console.error('Surah API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}