import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useShowListQuery } from "../hooks/useShowListQuery.js";
import { useQuickView } from "../hooks/useQuickView.js";
import Hero from "../components/Hero/Hero.jsx";
import Carousel from "../components/Carousel/Carousel.jsx";
import Filters from "../components/Filters/Filters.jsx";
import ShowGrid from "../components/ShowGrid/ShowGrid.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import QuickViewModal from "../components/QuickViewModal/QuickViewModal.jsx";
import { LoadingState, ErrorState, EmptyState } from "../components/StatusStates/StatusStates.jsx";

/** sessionStorage key used to remember the last homepage URL (path + query). */
export const LAST_HOME_URL_KEY = "podcastExplorer:lastHomeUrl";

/**
 * Homepage/listing page: hero intro, search, filter, sort, paginate, and
 * browse to individual show detail pages — or open a quick-view modal
 * without leaving the grid.
 *
 * Filter/search/sort/page state lives in the URL query string (see
 * `useShowListQuery`), and this component also mirrors the current
 * location into sessionStorage. That gives the show detail page a
 * reliable "back to shows" target even if the user arrived at a show
 * page directly (e.g. a shared link) rather than via browser navigation.
 *
 * @returns {JSX.Element}
 */
export default function HomePage() {
  const location = useLocation();
  const {
    shows,
    recommendedShows,
    totalCount,
    totalPages,
    isLoading,
    error,
    search,
    genre,
    sort,
    page,
    hasActiveFilters,
    setSearch,
    setGenre,
    setSort,
    setPage,
    resetFilters,
  } = useShowListQuery();

  const quickView = useQuickView();

  useEffect(() => {
    sessionStorage.setItem(LAST_HOME_URL_KEY, `${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <section>
      <Hero />

      {!isLoading && !error && <Carousel shows={recommendedShows} />}

      <h2 className="visually-hidden">Podcast shows</h2>

      <Filters
        search={search}
        genre={genre}
        sort={sort}
        resultCount={totalCount}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onGenreChange={setGenre}
        onSortChange={setSort}
        onReset={resetFilters}
      />

      {isLoading && <LoadingState label="Loading shows…" />}

      {!isLoading && error && (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      )}

      {!isLoading && !error && totalCount === 0 && (
        <EmptyState
          title="No shows match your search"
          message="Try a different search term or clear your filters."
        />
      )}

      {!isLoading && !error && totalCount > 0 && (
        <>
          <ShowGrid shows={shows} onQuickView={quickView.open} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {quickView.isOpen && (
        <QuickViewModal
          show={quickView.show}
          isLoading={quickView.isLoading}
          error={quickView.error}
          onClose={quickView.close}
        />
      )}
    </section>
  );
}
