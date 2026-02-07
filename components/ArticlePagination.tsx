import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ArticlePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ArticlePagination({
  currentPage,
  totalPages,
  onPageChange,
}: ArticlePaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (isMobile: boolean = false) => {
    const pages: (number | string)[] = [];
    const maxPages = isMobile ? 3 : 7;
    const showEllipsis = totalPages > maxPages;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (isMobile) {
      if (currentPage > 2 && currentPage < totalPages - 1) {
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      } else if (currentPage <= 2) {
        if (totalPages > 2) pages.push(2);
        pages.push('...');
      } else {
        pages.push('...');
        if (totalPages > 2) pages.push(totalPages - 1);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = Math.max(2, totalPages - 4); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
    }

    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <div className="hidden md:flex justify-center items-center gap-3 py-10 border-t-[6px] border-double border-black dark:border-gray-300 mt-12">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-2 border-black dark:border-gray-300 font-bold disabled:opacity-50 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors"
        >
          Previous
        </Button>

        {getPageNumbers(false).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 font-bold text-xl">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              onClick={() => onPageChange(pageNum)}
              className={
                currentPage === pageNum
                  ? 'bg-black text-white dark:bg-gray-300 dark:text-black border-2 border-black dark:border-gray-300 font-bold'
                  : 'border-2 border-black dark:border-gray-300 font-bold hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors'
              }
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-2 border-black dark:border-gray-300 font-bold disabled:opacity-50 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors"
        >
          Next
        </Button>
      </div>

      <div className="flex md:hidden justify-center items-center gap-1.5 py-8 border-t-[6px] border-double border-black dark:border-gray-300 mt-12">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-2 border-black dark:border-gray-300 font-bold disabled:opacity-50 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers(true).map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-1 font-bold text-lg">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'outline'}
              size="icon"
              onClick={() => onPageChange(pageNum)}
              className={
                currentPage === pageNum
                  ? 'bg-black text-white dark:bg-gray-300 dark:text-black border-2 border-black dark:border-gray-300 font-bold h-9 w-9 text-sm'
                  : 'border-2 border-black dark:border-gray-300 font-bold hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors h-9 w-9 text-sm'
              }
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-2 border-black dark:border-gray-300 font-bold disabled:opacity-50 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
