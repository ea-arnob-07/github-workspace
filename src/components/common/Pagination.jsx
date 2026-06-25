import './Pagination.css';

/**
 * Pagination — Page navigation controls.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageRange,
  hasNextPage,
  hasPrevPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        ← Prev
      </button>

      <div className="pagination-pages">
        {pageRange[0] > 1 && (
          <>
            <button className="pagination-page" onClick={() => onPageChange(1)}>1</button>
            {pageRange[0] > 2 && <span className="pagination-dots">…</span>}
          </>
        )}

        {pageRange.map((page) => (
          <button
            key={page}
            className={`pagination-page ${page === currentPage ? 'pagination-active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span className="pagination-dots">…</span>
            )}
            <button className="pagination-page" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </div>
  );
}
