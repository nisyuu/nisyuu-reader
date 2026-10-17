import Parser from 'rss-parser';
import { unstable_cache } from 'next/cache';
import { FEEDS } from '@/lib/feeds';
import type { ArticleWithFeed, Feed } from '@/types/article';

const DAYS_TO_KEEP = 3;
const FEED_TIMEOUT_MS = 10_000;

const parser = new Parser();

async function fetchFeed(feed: Feed): Promise<ArticleWithFeed[]> {
  const res = await fetch(feed.url, { signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const rss = await parser.parseString(await res.text());

  return rss.items.flatMap((item) => {
    if (!item.link || !item.title) {
      return [];
    }
    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    return [{
      id: item.link,
      title: item.title,
      link: item.link,
      description: item.contentSnippet || item.content || null,
      pub_date: pubDate && !isNaN(pubDate.getTime()) ? pubDate.toISOString() : null,
      feed_name: feed.name,
    }];
  });
}

async function fetchAllArticles(): Promise<ArticleWithFeed[]> {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  // 全滅した結果をキャッシュすると1時間空のままになるので、throwしてキャッシュさせない
  if (results.every((result) => result.status === 'rejected')) {
    throw new Error('Failed to fetch all RSS feeds');
  }

  const cutoff = Date.now() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000;
  const byLink = new Map<string, ArticleWithFeed>();
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Failed to fetch RSS feed: ${FEEDS[i].name}`, result.reason);
      return;
    }
    for (const article of result.value) {
      if (article.pub_date && new Date(article.pub_date).getTime() < cutoff) {
        continue;
      }
      if (!byLink.has(article.link)) {
        byLink.set(article.link, article);
      }
    }
  });

  return Array.from(byLink.values()).sort((a, b) => {
    if (!a.pub_date) return b.pub_date ? 1 : 0;
    if (!b.pub_date) return -1;
    return b.pub_date.localeCompare(a.pub_date);
  });
}

// 以前のSupabaseのcronと同じく1時間ごとに取り直す
export const getArticles = unstable_cache(fetchAllArticles, ['articles'], {
  revalidate: 60 * 60,
});

export function filterByDate(articles: ArticleWithFeed[], dateFilter: string | null): ArticleWithFeed[] {
  if (dateFilter !== 'today' && dateFilter !== 'yesterday' && dateFilter !== 'day_before_yesterday') {
    return articles;
  }

  const nowUTC = new Date();
  const nowJST = new Date(nowUTC.getTime() + (9 * 60 * 60 * 1000));
  const todayUTC = Date.UTC(nowJST.getUTCFullYear(), nowJST.getUTCMonth(), nowJST.getUTCDate()) - (9 * 60 * 60 * 1000);
  const day = 24 * 60 * 60 * 1000;
  const offset = { today: 0, yesterday: 1, day_before_yesterday: 2 }[dateFilter];
  const from = todayUTC - offset * day;
  const to = from + day;

  return articles.filter((article) => {
    if (!article.pub_date) return false;
    const t = new Date(article.pub_date).getTime();
    return t >= from && t < to;
  });
}
