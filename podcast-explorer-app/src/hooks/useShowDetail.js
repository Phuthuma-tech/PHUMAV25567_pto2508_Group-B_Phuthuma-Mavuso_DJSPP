import { useEffect, useState } from "react";
import { fetchShowById } from "../api/podcastApi.js";

/**
 * @typedef {Object} ShowDetailState
 * @property {Object|null} show - Full SHOW object (with embedded seasons/episodes), or null.
 * @property {boolean} isLoading - Whether the show is currently being fetched.
 * @property {string|null} error - Error message, if the fetch failed.
 */

/**
 * Fetch a single show's full detail record based on a route parameter.
 *
 * Re-fetches automatically whenever `showId` changes (e.g. the user
 * navigates directly from one show's detail page to another).
 *
 * @param {string|undefined} showId - The show id taken from the route param.
 * @returns {ShowDetailState}
 */
export function useShowDetail(showId) {
  const [show, setShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showId) {
      setShow(null);
      setIsLoading(false);
      setError("No show was specified.");
      return;
    }

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

  return { show, isLoading, error };
}
