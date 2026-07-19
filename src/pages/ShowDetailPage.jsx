import { Link, useParams } from "react-router-dom";
import { useShowDetail } from "../hooks/useShowDetail.js";
import { getGenreTitles } from "../utils/genres.js";
import { formatUpdatedDate } from "../utils/formatDate.js";
import { stripHtml } from "../utils/text.js";
import GenreTags from "../components/GenreTags/GenreTags.jsx";
import SeasonAccordion from "../components/SeasonAccordion/SeasonAccordion.jsx";
import { LoadingState, ErrorState, EmptyState } from "../components/StatusStates/StatusStates.jsx";
import { LAST_HOME_URL_KEY } from "./HomePage.jsx";
import "./ShowDetailPage.css";

/**
 * Resolve where the "back to shows" link should point: the homepage URL
 * (including whatever search/filter/sort/page params were active) that
 * was last recorded in sessionStorage, falling back to a bare root.
 *
 * @returns {string} A relative URL for the Link's `to` prop.
 */
function getBackToShowsHref() {
  return sessionStorage.getItem(LAST_HOME_URL_KEY) || "/";
}

/**
 * Dynamic show detail page, reached via the `/show/:showId` route.
 * Fetches the full show record (with embedded seasons/episodes) based
 * on the route parameter and renders title, artwork, description, genre
 * tags, last-updated date, and season/episode navigation.
 *
 * @returns {JSX.Element}
 */
export default function ShowDetailPage() {
  const { showId } = useParams();
  const { show, isLoading, error } = useShowDetail(showId);
  const backHref = getBackToShowsHref();

  if (isLoading) {
    return <LoadingState label="Loading show details…" />;
  }

  if (error) {
    return (
      <>
        <Link to={backHref} className="show-detail__back">
          ← Back to shows
        </Link>
        <ErrorState message={error} />
      </>
    );
  }

  if (!show) {
    return (
      <>
        <Link to={backHref} className="show-detail__back">
          ← Back to shows
        </Link>
        <EmptyState title="Show not found" message="This show may have been removed." />
      </>
    );
  }

  const genreTitles = getGenreTitles(show.genres);

  return (
    <article>
      <Link to={backHref} className="show-detail__back">
        ← Back to shows
      </Link>

      <div className="show-detail__hero">
        <img src={show.image} alt="" className="show-detail__image" />

        <div className="show-detail__info">
          <h1 className="show-detail__title">{show.title}</h1>
          <GenreTags titles={genreTitles} />
          <p className="show-detail__description">{stripHtml(show.description)}</p>
          <p className="show-detail__updated">
            Last updated {formatUpdatedDate(show.updated)}
          </p>
        </div>
      </div>

      <section className="show-detail__seasons">
        <h2 className="show-detail__seasons-heading">
          Seasons <span className="show-detail__seasons-count">({show.seasons.length})</span>
        </h2>
        <SeasonAccordion seasons={show.seasons} />
      </section>
    </article>
  );
}
