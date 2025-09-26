import { NextRequest, NextResponse } from 'next/server';
import { searchHadithWithCache } from '@/lib/cached-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const useCache = searchParams.get('cache') !== 'false';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchHadithWithCache(query, useCache);
    
    return NextResponse.json({
      success: true,
      results,
      total: results.length
    });
  } catch (error) {
    console.error('Hadith search API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}