import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import type { Database, Feed } from '@/types/database';

const parser = new Parser();

export async function fetchAndStoreRSSFeeds() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or SERVICE_ROLE_KEY not found in environment variables');
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

  const { data: feeds, error: feedsError } = await supabase
    .from('feeds')
    .select('*');

  if (feedsError || !feeds || feeds.length === 0) {
    throw new Error(`Failed to fetch feeds: ${feedsError?.message || 'No feeds found'}`);
  }

  const feedsList: Feed[] = feeds;

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (const feed of feedsList) {
    try {
      const rssFeed = await parser.parseURL(feed.url);

      for (const item of rssFeed.items) {
        if (!item.link || !item.title) {
          continue;
        }

        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('link', item.link)
          .maybeSingle();

        if (existingArticle) {
          results.skipped++;
          continue;
        }

        const { error: insertError } = await supabase
          .from('articles')
          .insert({
            feed_id: feed.id,
            title: item.title,
            link: item.link,
            description: item.contentSnippet || item.content || null,
            pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
          } as any);

        if (insertError) {
          console.error(`Failed to insert article: ${item.title}`, insertError);
          results.failed++;
        } else {
          results.success++;
        }
      }
    } catch (error) {
      console.error(`Failed to fetch RSS feed: ${feed.name}`, error);
      results.failed++;
    }
  }

  return results;
}

export async function cleanupOldArticles(daysToKeep: number = 7) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or SERVICE_ROLE_KEY not found in environment variables');
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const { data, error } = await supabase
    .from('articles')
    .delete()
    .lt('created_at', cutoffDate.toISOString())
    .select('id');

  if (error) {
    throw new Error(`Failed to cleanup old articles: ${error.message}`);
  }

  return {
    deleted: data?.length || 0,
  };
}
