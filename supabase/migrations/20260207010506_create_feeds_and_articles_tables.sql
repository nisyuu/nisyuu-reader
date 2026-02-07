/*
  # NISYUU READER - RSS Feed Reader Database Schema

  ## Overview
  This migration creates the core database structure for the NISYUU READER application,
  a newspaper-style RSS feed reader that aggregates news from multiple sources.

  ## New Tables

  ### 1. feeds
  Stores RSS feed sources that the application monitors
  - `id` (uuid, primary key) - Unique identifier for each feed
  - `url` (text, unique, not null) - The RSS feed URL
  - `name` (text, not null) - Display name of the feed source
  - `created_at` (timestamptz) - When the feed was added

  ### 2. articles
  Stores individual articles fetched from RSS feeds
  - `id` (uuid, primary key) - Unique identifier for each article
  - `feed_id` (uuid, foreign key) - References the source feed
  - `title` (text, not null) - Article headline
  - `link` (text, unique, not null) - Article URL (unique to prevent duplicates)
  - `description` (text) - Article summary or excerpt
  - `pub_date` (timestamptz) - Original publication date
  - `created_at` (timestamptz) - When the article was added to database

  ## Indexes
  - `articles_pub_date_idx` - Speeds up sorting by publication date
  - `articles_link_idx` - Speeds up duplicate checking by link

  ## Initial Data
  Populates the feeds table with 14 Japanese RSS news sources covering:
  - General news (NHK, Asahi, Mainichi, Yomiuri)
  - Technology (TechCrunch Japan, Engadget Japan, CNET Japan, Impress Watch)
  - International (BBC News Japan, Reuters Japan)
  - Business & Economy (Nikkei, Toyo Keizai)
  - Culture & Trends (ITmedia, Yahoo Japan)

  ## Security
  - Enable RLS on both tables
  - Public read access for all users (news reader is public)
  - No write access from client (all writes through server functions)
*/

-- Create feeds table
CREATE TABLE IF NOT EXISTS feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  title text NOT NULL,
  link text UNIQUE NOT NULL,
  description text,
  pub_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS articles_pub_date_idx ON articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS articles_link_idx ON articles(link);
CREATE INDEX IF NOT EXISTS articles_feed_id_idx ON articles(feed_id);

-- Enable Row Level Security
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to feeds (anyone can view feed sources)
CREATE POLICY "Public can view feeds"
  ON feeds
  FOR SELECT
  USING (true);

-- Allow public read access to articles (anyone can view articles)
CREATE POLICY "Public can view articles"
  ON articles
  FOR SELECT
  USING (true);

-- Insert initial RSS feed sources
INSERT INTO feeds (url, name) VALUES
  ('https://www3.nhk.or.jp/rss/news/cat0.xml', 'NHK News'),
  ('https://www.asahi.com/rss/asahi/newsheadlines.rdf', 'Asahi Shimbun'),
  ('https://mainichi.jp/rss/etc/mainichi-flash.rss', 'Mainichi Shimbun'),
  ('https://www.yomiuri.co.jp/rss/index.xml', 'Yomiuri Shimbun'),
  ('https://jp.techcrunch.com/feed/', 'TechCrunch Japan'),
  ('https://japanese.engadget.com/rss.xml', 'Engadget Japan'),
  ('https://japan.cnet.com/rss/news/', 'CNET Japan'),
  ('https://www.watch.impress.co.jp/data/rss/1.0/ipw/feed.rdf', 'Impress Watch'),
  ('https://www.bbc.com/japanese/index.xml', 'BBC News Japan'),
  ('https://jp.reuters.com/rssFeed/topNews', 'Reuters Japan'),
  ('https://www.nikkei.com/rss/', 'Nikkei'),
  ('https://toyokeizai.net/list/feed/rss', 'Toyo Keizai'),
  ('https://www.itmedia.co.jp/rss/2.0/news_bursts.xml', 'ITmedia'),
  ('https://news.yahoo.co.jp/rss/topics/top-picks.xml', 'Yahoo Japan News')
ON CONFLICT (url) DO NOTHING;