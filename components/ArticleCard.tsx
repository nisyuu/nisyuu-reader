import type { ArticleWithFeed } from '@/types/database';

interface ArticleCardProps {
  article: ArticleWithFeed;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <article className="py-8 border-b-[3px] border-double border-black dark:border-gray-300 last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 dark:text-gray-400 border-l-4 border-black dark:border-gray-300 pl-3">
          {article.feed_name}
        </span>
        {article.pub_date && (
          <span className="text-xs text-gray-600 dark:text-gray-500 font-semibold">
            {formatDate(article.pub_date)}
          </span>
        )}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline decoration-2 underline-offset-4 transition-all"
        >
          {article.title}
        </a>
      </h2>
      {article.description && (
        <p className="text-base md:text-lg text-gray-800 dark:text-gray-300 leading-relaxed line-clamp-3">
          {article.description}
        </p>
      )}
    </article>
  );
}
