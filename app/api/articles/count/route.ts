import { NextResponse } from 'next/server';
import { filterByDate, getArticles } from '@/lib/articles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {

    const articles = filterByDate(await getArticles(), searchParams.get('date_filter'));

    return NextResponse.json({ count: articles.length });
  } catch (error) {
    console.error('Error counting articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
