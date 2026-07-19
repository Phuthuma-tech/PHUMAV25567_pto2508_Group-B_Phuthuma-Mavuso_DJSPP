import { useCallback, useEffect, useState } from "react";
import { fetchShowById } from "../api/podcastApi.js";

/**
 * @typedef {Object} QuickViewState
 * @property {Object|null} show - Full SHOW object for the open quick-view modal, or null when closed.
 * @property {boolean} isLoading - True while the show detail fetch for the modal is in progress.
 * @property {string|null} error - Error message if the quick-view fetch failed.
 * @property {(showId: string|number) => void} open - Opens the modal and fetches the given show.
 * @property {() => void} close - Closes the modal and clears its state.
 */

/**
 * Drives the "quick view" modal — DJS03's original way of previewing a
 * show's full detail (image, description, genres, season list) without
 * leaving the grid. DJS05 replaced this with a dedicated `/show/:id` route,
 * which is great for deep-linking and full season/episode browsing, but
 * loses the fast, no-navigation glance DJS03 offered. This hook restores
 * that option alongside the routed page: a card's "Quick view" button opens
 * this modal, while clicking the card itself still navigates to the full
 * detail page for deeper exploration (episodes, season accordion, etc.).
 *
 * @returns {QuickViewState}
 */
export function useQuickView() {
  const [showId, setShowId] = useState(null);
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setShow(null);

    fetchShowById(showId)
      .then((data) => {
        if (!cancelled) setShow(data);
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
  }, [showId]);

  const open = useCallback((id) => setShowId(id), []);
  const close = useCallback(() => {
    setShowId(null);
    setShow(null);
    setError(null);
  }, []);

  return { show, isLoading, error, isOpen: showId !== null, open, close };
}
