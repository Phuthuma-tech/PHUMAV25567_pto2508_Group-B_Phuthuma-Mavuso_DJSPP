import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllPreviews } from "../api/podcastApi.js";
import { getGenreTitles } from "../utils/genres.js";

/** Number of shows displayed per page on the homepage. */
const PAGE_SIZE = 12;

/**
 * @typedef {Object} ShowListQueryState
 * @property {Array<Object>} shows - Paginated, filtered, sorted shows for the current page.
 * @property {number} totalCount - Total number of shows matching the current filters.
 * @property {number} totalPages - Total number of pages for the current filters.
 * @property {boolean} isLoading - Whether the preview list is being fetched.
 * @property {string|null} error - Error message, if the fetch failed.
 * @property {string} search - Current search term.
 * @property {string} genre - Current genre filter ("all" or a genre id as string).
 * @property {string} sort - Current sort key.
 * @property {number} page - Current 1-indexed page number.
 * @property {boolean} hasActiveFilters - Whether a non-default search/genre/sort is active.
 * @property {(value: string) => void} setSearch
 * @property {(value: string) => void} setGenre
 * @property {(value: string) => void} setSort
 * @property {(value: number) => void} setPage
 * @property {() => void} resetFilters
 */

/**
 * Centralised state + data hook for the homepage/listing page.
 *
 * All search, filter, sort, and pagination state is mirrored into the URL's
 * query string via `useSearchParams` (carried over from DJS05). This means
 * the homepage URL always fully describes what the user is looking at, so
 * navigating to a show and back (browser back, or a "back to shows" link)
 * restores the exact same view without any extra state-management plumbing —
 * the same guarantee DJS04's `usePodcastExplorer` gave with in-memory state,
 * now durable across navigation and shareable as a link.
 *
 * @returns {ShowListQueryState}
 */
export function useShowListQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allShows, setAllShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const search = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchAllPreviews()
      .then((data) => {
        if (!cancelled) setAllShows(data);
      })
      .catch((fetchError) => {
        if (!cancelled) setError(fetchError.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Update one query parameter while preserving the others, resetting the
   * page back to 1 whenever a filter (not the page itself) changes.
   *
   * @param {string} key - Query param name to update.
   * @param {string} value - New value; empty/"all"/"1" removes the param to keep URLs tidy.
   * @param {{ resetPage?: boolean }} [options]
   */
  const updateParam = useCallback(
    (key, value, { resetPage = true } = {}) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (!value || value === "all" || (key === "page" && value === "1")) {
          next.delete(key);
        } else {
          next.set(key, value);
        }

        if (resetPage && key !== "page") next.delete("page");

        return next;
      });
    },
    [setSearchParams]
  );

  const setSearch = useCallback((value) => updateParam("q", value), [updateParam]);
  const setGenre = useCallback((value) => updateParam("genre", value), [updateParam]);
  const setSort = useCallback((value) => updateParam("sort", value), [updateParam]);
  const setPage = useCallback(
    (value) => updateParam("page", String(value), { resetPage: false }),
    [updateParam]
  );

  /**
   * Clears search, genre, and sort back to their defaults and returns to
   * page 1 — carried over from DJS04's "Clear filters" toolbar action.
   */
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const filteredAndSorted = useMemo(() => {
    let result = allShows;

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((show) => show.title.toLowerCase().includes(term));
    }

    if (genre !== "all") {
      const genreId = Number(genre);
      result = result.filter((show) => show.genres?.includes(genreId));
    }

    const sorted = [...result];
    switch (sort) {
      case "oldest":
        sorted.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case "az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
    }

    return sorted;
  }, [allShows, search, genre, sort]);

  const totalCount = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const shows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE).map((show) => ({
      ...show,
      genreTitles: getGenreTitles(show.genres),
    }));
  }, [filteredAndSorted, safePage]);

  const hasActiveFilters = search.trim() !== "" || genre !== "all" || sort !== "newest";

  return {
    shows,
    totalCount,
    totalPages,
    isLoading,
    error,
    search,
    genre,
    sort,
    page: safePage,
    hasActiveFilters,
    setSearch,
    setGenre,
    setSort,
    setPage,
    resetFilters,
  };
}
