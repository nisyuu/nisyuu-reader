import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('date_filter');

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

      if (dateFilter === 'today') {
        query = query.gte('pub_date', today.toISOString());
      } else if (dateFilter === 'yesterday') {
        query = query
          .gte('pub_date', yesterday.toISOString())
          .lt('pub_date', today.toISOString());
      } else if (dateFilter === 'day_before_yesterday') {
        query = query
          .gte('pub_date', dayBeforeYesterday.toISOString())
          .lt('pub_date', yesterday.toISOString());
      }
    }

    const { count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to count articles' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error counting articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
