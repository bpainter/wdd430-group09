// components/Pagination.tsx
import { useRouter } from 'next/router';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const { query } = router;
  
  const startPage = Math.max(currentPage - 2, 1);
  const endPage = Math.min(startPage + 4, totalPages);
  const pages = Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="page-count">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to <span className="font-medium">{currentPage * 20}</span> of{' '}
            <span className="font-medium">{totalPages * 20}</span> results
          </p>
        </div>
        <div className="pagination-links">
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Link href={`/products?page=${Math.max(1, currentPage - 1)}${query.category ? `&category=${query.category}` : ''}${query.sort ? `&sort=${query.sort}` : ''}`} className={`previous-button relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 pointer-events-none' : 'text-gray-700 hover:bg-gray-50'}`}>
              Previous
            </Link>
            {pages.map((page, i) => (
              <Link key={i} href={`/products?page=${page}${query.category ? `&category=${query.category}` : ''}${query.sort ? `&sort=${query.sort}` : ''}`} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page ? 'text-white bg-indigo-600' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}>
                {page}
              </Link>
            ))}
            {endPage < totalPages && (
              <>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                  ...
                </span>
                <Link href={`/products?page=${totalPages}${query.category ? `&category=${query.category}` : ''}${query.sort ? `&sort=${query.sort}` : ''}`} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  {totalPages}
                </Link>
              </>
            )}
            <Link href={`/products?page=${Math.min(totalPages, currentPage + 1)}${query.category ? `&category=${query.category}` : ''}${query.sort ? `&sort=${query.sort}` : ''}`} className={`next-button relative ml-3 inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 pointer-events-none' : 'text-gray-700 hover:bg-gray-50'}`}>
              Next
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}