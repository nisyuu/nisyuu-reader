import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        link,
        description,
        pub_date,
        created_at,
        feeds!inner(name)
      `)
      .order('pub_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    const articles = data.map((article: any) => ({
      id: article.id,
      title: article.title,
      link: article.link,
      description: article.description,
      pub_date: article.pub_date,
      created_at: article.created_at,
      feed_name: article.feeds.name,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
