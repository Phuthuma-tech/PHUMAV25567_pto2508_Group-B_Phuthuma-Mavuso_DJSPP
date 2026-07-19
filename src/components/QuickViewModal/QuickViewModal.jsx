import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenreTitles } from "../../utils/genres.js";
import { formatRelativeDate, formatShortDate } from "../../utils/formatDate.js";
import { stripHtml } from "../../utils/text.js";
import "./QuickViewModal.css";

/**
 * Full-screen overlay presenting a quick summary of a show — image,
 * description, genres, and a season-by-season episode count — without
 * navigating away from the grid. This is DJS03's original modal pattern,
 * restyled to match the shared design tokens and extended with a link
 * through to the full routed detail page (DJS05) for anyone who wants to
 * browse individual episodes.
 *
 * Closes on backdrop click or Escape key press, matching DJS03's behaviour.
 *
 * @param {{
 *   show: Object|null,
 *   isLoading: boolean,
 *   error: string|null,
 *   onClose: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export default function QuickViewModal({ show, isLoading, error, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const genreTitles = show ? getGenreTitles(show.genres) : [];

  return (
    <div
      className="quick-view"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={show ? `Quick view of ${show.title}` : "Loading show details"}
    >
      <div className="quick-view__content">
        <button className="quick-view__close" onClick={onClose} aria-label="Close quick view">
          ✕
        </button>

        {isLoading && (
          <div className="quick-view__status" role="status" aria-live="polite">
            <span className="quick-view__spinner" aria-hidden="true" />
            <p>Loading show details…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="quick-view__status quick-view__status--error" role="alert">
            <p>Something went wrong</p>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && show && (
          <>
            <h2 className="quick-view__title">{show.title}</h2>

            <div className="quick-view__banner">
              <img className="quick-view__image" src={show.image} alt={`${show.title} cover art`} />
              <div className="quick-view__info">
                <h3 className="quick-view__seasons-heading">
                  {show.seasons?.length ?? 0} Season{show.seasons?.length !== 1 ? "s" : ""}
                </h3>

                {genreTitles.length > 0 && (
                  <div className="quick-view__tags" aria-label="Genres">
                    {genreTitles.map((title) => (
                      <span key={title} className="quick-view__tag">
                        {title}
                      </span>
                    ))}
                  </div>
                )}

                <p className="quick-view__description">{stripHtml(show.description)}</p>

                <p className="quick-view__updated">
                  Last updated:{" "}
                  <time dateTime={show.updated}>
                    {formatRelativeDate(show.updated)} ({formatShortDate(show.updated)})
                  </time>
                </p>
              </div>
            </div>

            <div className="quick-view__seasons">
              <h4 className="quick-view__seasons-list-heading">Seasons</h4>
              <ul aria-label="Seasons list">
                {show.seasons?.map((season) => (
                  <li key={season.season} className="quick-view__season-item">
                    <span className="quick-view__season-title">
                      Season {season.season}: {season.title}
                    </span>
                    <span className="quick-view__season-episodes">
                      {season.episodes?.length ?? 0} episode
                      {(season.episodes?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to={`/show/${show.id}`} className="quick-view__full-link" onClick={onClose}>
              Browse episodes on the full show page →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
