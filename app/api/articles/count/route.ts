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
