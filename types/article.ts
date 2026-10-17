export type Feed = {
  url: string;
  name: string;
};

export type ArticleWithFeed = {
  id: string;
  title: string;
  link: string;
  description: string | null;
  pub_date: string | null;
  feed_name: string;
};
