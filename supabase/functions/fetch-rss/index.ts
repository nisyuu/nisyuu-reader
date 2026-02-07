import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Parser from "npm:rss-parser@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const parser = new Parser();

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: feeds, error: feedsError } = await supabase
      .from("feeds")
      .select("*");

    if (feedsError || !feeds || feeds.length === 0) {
      throw new Error(`Failed to fetch feeds: ${feedsError?.message || "No feeds found"}`);
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
    };

    for (const feed of feeds) {
      try {
        const rssFeed = await parser.parseURL(feed.url);

        for (const item of rssFeed.items) {
          if (!item.link || !item.title) {
            continue;
          }

          const { data: existingArticle } = await supabase
            .from("articles")
            .select("id")
            .eq("link", item.link)
            .maybeSingle();

          if (existingArticle) {
            results.skipped++;
            continue;
          }

          const { error: insertError } = await supabase
            .from("articles")
            .insert({
              feed_id: feed.id,
              title: item.title,
              link: item.link,
              description: item.contentSnippet || item.content || null,
              pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
            });

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

    return new Response(
      JSON.stringify({
        message: "RSS feeds fetched successfully",
        results,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("RSS fetch failed:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch RSS feeds",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
