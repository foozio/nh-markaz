import { NextResponse } from 'next/server';
import { getCachedSurahs } from '@/lib/cached-api';

export async function GET() {
  try {
    const surahs = await getCachedSurahs();
    
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