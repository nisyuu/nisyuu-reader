export type Database = {
  public: {
    Tables: {
      feeds: {
        Row: {
          id: string;
          url: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          name?: string;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          feed_id: string;
          title: string;
          link: string;
          description: string | null;
          pub_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          feed_id: string;
          title: string;
          link: string;
          description?: string | null;
          pub_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          feed_id?: string;
          title?: string;
          link?: string;
          description?: string | null;
          pub_date?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

export type Feed = Database['public']['Tables']['feeds']['Row'];
export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleWithFeed = Article & { feed_name: string };
