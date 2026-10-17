import type { Feed } from '@/types/article';

export const FEEDS: Feed[] = [
  { url: 'https://www3.nhk.or.jp/rss/news/cat0.xml', name: 'NHK News' },
  { url: 'https://www.asahi.com/rss/asahi/newsheadlines.rdf', name: 'Asahi Shimbun' },
  { url: 'https://mainichi.jp/rss/etc/mainichi-flash.rss', name: 'Mainichi Shimbun' },
  { url: 'https://www.yomiuri.co.jp/rss/index.xml', name: 'Yomiuri Shimbun' },
  { url: 'https://jp.techcrunch.com/feed/', name: 'TechCrunch Japan' },
  { url: 'https://japanese.engadget.com/rss.xml', name: 'Engadget Japan' },
  { url: 'https://japan.cnet.com/rss/news/', name: 'CNET Japan' },
  { url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf', name: 'Impress Watch' },
  { url: 'https://www.bbc.com/japanese/index.xml', name: 'BBC News Japan' },
  { url: 'https://jp.reuters.com/rssFeed/topNews', name: 'Reuters Japan' },
  { url: 'https://www.nikkei.com/rss/', name: 'Nikkei' },
  { url: 'https://toyokeizai.net/list/feed/rss', name: 'Toyo Keizai' },
  { url: 'https://www.itmedia.co.jp/rss/2.0/news_bursts.xml', name: 'ITmedia' },
  { url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml', name: 'Yahoo Japan News' },
];
