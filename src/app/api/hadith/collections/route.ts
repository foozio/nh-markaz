import { NextResponse } from 'next/server';
import { getCachedHadithCollections } from '@/lib/cached-api';

export async function GET() {
  try {
    const collections = await getCachedHadithCollections();
    
    return NextResponse.json({
      success: true,
      collections
    });
  } catch (error) {
    console.error('Hadith collections API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}