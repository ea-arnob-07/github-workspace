import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for pagination logic.
 *
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 * @returns {{ currentPage, totalPages, setPage, nextPage, prevPage, pageRange, startIndex, endIndex }}
 */
export function usePagination(totalItems = 0, itemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );

  // Ensure current page doesn't exceed total pages
  const safePage = Math.min(currentPage, totalPages);

  const setPage = useCallback(
    (page) => {
      const pageNum = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNum);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage(safePage + 1);
  }, [safePage, setPage]);

  const prevPage = useCallback(() => {
    setPage(safePage - 1);
  }, [safePage, setPage]);

  // Calculate visible page range for pagination controls
  const pageRange = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [safePage, totalPages]);

  // Indices for slicing data arrays
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage: safePage,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    pageRange,
    startIndex,
    endIndex,
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
  };
}
