import { NextResponse } from 'next/server';
import { getSurahs } from '@/lib/quran-api';

export async function GET() {
  try {
    const surahs = await getSurahs();
    
    return NextResponse.json({
      success: true,
      surahs
    });
  } catch (error) {
    console.error('Surahs API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}