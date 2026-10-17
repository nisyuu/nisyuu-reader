import type { Feed } from '@/types/article';

export const FEEDS: Feed[] = [
  { url: 'https://www.asahi.com/rss/asahi/newsheadlines.rdf', name: 'Asahi Shimbun' },
  { url: 'https://mainichi.jp/rss/etc/mainichi-flash.rss', name: 'Mainichi Shimbun' },
  { url: 'https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf', name: 'Impress Watch' },
  { url: 'https://toyokeizai.net/list/feed/rss', name: 'Toyo Keizai' },
  { url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml', name: 'Yahoo Japan News' },
  { url: 'https://www.publickey1.jp/atom.xml', name: 'Publickey' },
  { url: 'https://rss.itmedia.co.jp/rss/2.0/ait.xml', name: '@IT' },
  { url: 'https://gihyo.jp/feed/rss2', name: 'gihyo.jp' },
  { url: 'https://codezine.jp/rss/new/20/index.xml', name: 'CodeZine' },
  { url: 'https://zenn.dev/feed', name: 'Zenn' },
  { url: 'https://qiita.com/popular-items/feed', name: 'Qiita' },
  { url: 'https://b.hatena.ne.jp/hotentry/it.rss', name: 'Hatena Bookmark' },
  { url: 'https://rss.itmedia.co.jp/rss/2.0/news_bursts.xml', name: 'ITmedia NEWS' },
  { url: 'https://internet.watch.impress.co.jp/data/rss/1.0/iw/feed.rdf', name: 'INTERNET Watch' },
  { url: 'https://xtech.nikkei.com/rss/index.rdf', name: 'Nikkei xTECH' },
  { url: 'https://gigazine.net/news/rss_2.0/', name: 'GIGAZINE' },
  { url: 'https://www.gizmodo.jp/index.xml', name: 'Gizmodo Japan' },
  { url: 'https://ascii.jp/rss.xml', name: 'ASCII.jp' },
  { url: 'https://pc.watch.impress.co.jp/data/rss/1.0/pcw/feed.rdf', name: 'PC Watch' },
  { url: 'https://forest.watch.impress.co.jp/data/rss/1.0/wf/feed.rdf', name: 'Mado no Mori' },
];
