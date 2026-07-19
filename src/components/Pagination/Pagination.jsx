import "./Pagination.css";

/**
 * Simple previous/next pagination control with a page indicator.
 *
 * @param {{ page: number, totalPages: number, onPageChange: (page: number) => void }} props
 * @returns {JSX.Element|null}
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Show list pagination">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Previous
      </button>

      <span className="pagination__status">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </nav>
  );
}
