import { NextResponse } from 'next/server';
import { filterByDate, getArticles } from '@/lib/articles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const articles = filterByDate(await getArticles(), searchParams.get('date_filter'));

    return NextResponse.json(articles.slice(offset, offset + limit));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
