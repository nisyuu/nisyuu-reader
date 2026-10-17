import type { Feed } from '@/types/article';

export const FEEDS: Feed[] = [
  { url: 'https://www.asahi.com/rss/asahi/newsheadlines.rdf', name: 'Asahi Shimbun' },
  { url: 'https://mainichi.jp/rss/etc/mainichi-flash.rss', name: 'Mainichi Shimbun' },
  { url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf', name: 'Impress Watch' },
  { url: 'https://toyokeizai.net/list/feed/rss', name: 'Toyo Keizai' },
  { url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml', name: 'Yahoo Japan News' },
];
