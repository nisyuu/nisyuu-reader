import { Button } from '@/components/ui/button';

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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

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

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-3 py-10 border-t-[6px] border-double border-black dark:border-gray-300 mt-12">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-2 border-black dark:border-gray-300 font-bold disabled:opacity-50 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-colors"
      >
        Previous
      </Button>

      {getPageNumbers().map((page, index) => {
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
  );
}
