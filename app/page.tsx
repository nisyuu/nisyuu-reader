'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ArticleList from '@/components/ArticleList';
import ArticlePagination from '@/components/ArticlePagination';
import type { ArticleWithFeed } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

const ARTICLES_PER_PAGE = 20;

type DateFilter = 'all' | 'today' | 'yesterday' | 'day_before_yesterday';

export default function Home() {
  const [articles, setArticles] = useState<ArticleWithFeed[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  useEffect(() => {
    fetchArticles();
  }, [currentPage, dateFilter]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filterParam = dateFilter !== 'all' ? `&date_filter=${dateFilter}` : '';
      const [articlesRes, countRes] = await Promise.all([
        fetch(`/api/articles?page=${currentPage}&limit=${ARTICLES_PER_PAGE}${filterParam}`),
        fetch(`/api/articles/count?${dateFilter !== 'all' ? `date_filter=${dateFilter}` : ''}`),
      ]);

      if (!articlesRes.ok || !countRes.ok) {
        throw new Error('Failed to fetch articles');
      }

      const articlesData = await articlesRes.json();
      const countData = await countRes.json();

      setArticles(articlesData);
      setTotalPages(Math.ceil(countData.count / ARTICLES_PER_PAGE));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 max-w-5xl">
        <div className="flex gap-2 mb-8 border-b-[3px] border-double border-black dark:border-gray-300 pb-6">
          <button
            onClick={() => handleDateFilterChange('all')}
            className={`px-6 py-2 font-bold text-sm tracking-wider transition-all border-2 border-black dark:border-gray-300 ${
              dateFilter === 'all'
                ? 'bg-black dark:bg-gray-300 text-white dark:text-black'
                : 'bg-white dark:bg-gray-900 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleDateFilterChange('today')}
            className={`px-6 py-2 font-bold text-sm tracking-wider transition-all border-2 border-black dark:border-gray-300 ${
              dateFilter === 'today'
                ? 'bg-black dark:bg-gray-300 text-white dark:text-black'
                : 'bg-white dark:bg-gray-900 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleDateFilterChange('yesterday')}
            className={`px-6 py-2 font-bold text-sm tracking-wider transition-all border-2 border-black dark:border-gray-300 ${
              dateFilter === 'yesterday'
                ? 'bg-black dark:bg-gray-300 text-white dark:text-black'
                : 'bg-white dark:bg-gray-900 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => handleDateFilterChange('day_before_yesterday')}
            className={`px-6 py-2 font-bold text-sm tracking-wider transition-all border-2 border-black dark:border-gray-300 ${
              dateFilter === 'day_before_yesterday'
                ? 'bg-black dark:bg-gray-300 text-white dark:text-black'
                : 'bg-white dark:bg-gray-900 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            2 Days Ago
          </button>
        </div>
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="py-8 border-b-[3px] border-double border-black dark:border-gray-300">
                <Skeleton className="h-5 w-40 mb-3 bg-gray-400" />
                <Skeleton className="h-10 w-full mb-4 bg-gray-400" />
                <Skeleton className="h-24 w-full bg-gray-400" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 border-[4px] border-double border-black dark:border-gray-300 bg-red-50 dark:bg-red-950">
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">Error: {error}</p>
          </div>
        ) : (
          <>
            <ArticleList articles={articles} />
            <ArticlePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <footer className="border-t-[6px] border-double border-black dark:border-gray-300 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="border-t-2 border-b-2 border-black dark:border-gray-300 inline-block px-6 py-2">
            <p className="text-sm font-bold tracking-wider text-gray-700 dark:text-gray-400">
              NISYUU READER &copy; {new Date().getFullYear()}
            </p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-500 mt-4">
            All the news worth reading, curated daily
          </p>
        </div>
      </footer>
    </div>
  );
}
