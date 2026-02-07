import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const dateFilter = searchParams.get('date_filter');

    let query = supabase
      .from('articles')
      .select(`
        id,
        title,
        link,
        description,
        pub_date,
        created_at,
        feeds!inner(name)
      `);

    if (dateFilter) {
      const nowUTC = new Date();
      const nowJST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000));
      const todayJST = new Date(nowJST.getFullYear(), nowJST.getMonth(), nowJST.getDate());
      const todayUTC = new Date(todayJST.getTime() - (9 * 60 * 60 * 1000));

      const yesterdayUTC = new Date(todayUTC);
      yesterdayUTC.setDate(yesterdayUTC.getDate() - 1);

      const dayBeforeYesterdayUTC = new Date(todayUTC);
      dayBeforeYesterdayUTC.setDate(dayBeforeYesterdayUTC.getDate() - 2);

      const tomorrowUTC = new Date(todayUTC);
      tomorrowUTC.setDate(tomorrowUTC.getDate() + 1);

      if (dateFilter === 'today') {
        query = query
          .gte('pub_date', todayUTC.toISOString())
          .lt('pub_date', tomorrowUTC.toISOString());
      } else if (dateFilter === 'yesterday') {
        query = query
          .gte('pub_date', yesterdayUTC.toISOString())
          .lt('pub_date', todayUTC.toISOString());
      } else if (dateFilter === 'day_before_yesterday') {
        query = query
          .gte('pub_date', dayBeforeYesterdayUTC.toISOString())
          .lt('pub_date', yesterdayUTC.toISOString());
      }
    }

    const { data, error } = await query
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
