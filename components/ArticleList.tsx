import type { ArticleWithFeed } from '@/types/database';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: ArticleWithFeed[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20 border-[4px] border-double border-black dark:border-gray-300">
        <p className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-3">No articles found.</p>
        <p className="text-base text-gray-600 dark:text-gray-500">
          Articles will appear here once the RSS feeds are fetched.
        </p>
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
