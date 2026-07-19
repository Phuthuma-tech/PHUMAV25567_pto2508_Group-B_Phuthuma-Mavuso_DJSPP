import { Link } from "react-router-dom";
import { formatUpdatedDate } from "../../utils/formatDate.js";
import "./ShowCard.css";

/**
 * Clickable preview card for a single show. The card itself links to the
 * full show detail page (season/episode browsing, from DJS05), while the
 * "Quick view" button opens an in-place modal (DJS03's original pattern)
 * so users can glance at the description and season count without leaving
 * the grid.
 *
 * @param {{ show: Object, onQuickView?: (showId: string|number) => void }} props
 * @param {Object} props.show - PREVIEW object, enriched with `genreTitles`.
 * @param {Function} [props.onQuickView] - Called with the show id when "Quick view" is clicked.
 * @returns {JSX.Element}
 */
export default function ShowCard({ show, onQuickView }) {
  const handleQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onQuickView?.(show.id);
  };

  return (
    <Link to={`/show/${show.id}`} className="show-card">
      <div className="show-card__image-wrap">
        <img src={show.image} alt="" className="show-card__image" loading="lazy" />

        {onQuickView && (
          <button
            type="button"
            className="show-card__quick-view"
            onClick={handleQuickView}
            aria-label={`Quick view ${show.title}`}
          >
            Quick view
          </button>
        )}
      </div>
      <div className="show-card__body">
        <h3 className="show-card__title">{show.title}</h3>
        <p className="show-card__meta">
          {show.seasons} {show.seasons === 1 ? "season" : "seasons"}
        </p>
        {show.genreTitles?.length > 0 && (
          <ul className="show-card__genres">
            {show.genreTitles.slice(0, 3).map((title) => (
              <li key={title} className="show-card__genre-tag">
                {title}
              </li>
            ))}
          </ul>
        )}
        <p className="show-card__updated">Updated {formatUpdatedDate(show.updated)}</p>
      </div>
    </Link>
  );
}
