import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage.js";
import { buildEpisodeId } from "./AudioPlayerContext.jsx";

const FavouritesContext = createContext(null);

/** localStorage key for the favourites list. */
const FAVOURITES_KEY = "podcastExplorer:favourites";

/**
 * @typedef {Object} FavouriteEntry
 * @property {string} id - Composite `showId-seasonNumber-episodeNumber` id.
 * @property {string|number} showId
 * @property {string} showTitle
 * @property {number} seasonNumber
 * @property {string} seasonTitle
 * @property {number} episodeNumber
 * @property {string} episodeTitle
 * @property {string} episodeDescription
 * @property {string} image
 * @property {string} addedAt - ISO timestamp of when it was favourited.
 */

/**
 * Provides the app-wide favourites list, backed by localStorage so it
 * survives reloads and new sessions.
 *
 * @param {{ children: import("react").ReactNode }} props
 * @returns {JSX.Element}
 */
export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => readStorage(FAVOURITES_KEY, []));

  useEffect(() => {
    writeStorage(FAVOURITES_KEY, favourites);
  }, [favourites]);

  /**
   * @param {string} id - Composite episode id (see `buildEpisodeId`).
   * @returns {boolean}
   */
  const isFavourite = useCallback(
    (id) => favourites.some((entry) => entry.id === id),
    [favourites]
  );

  /**
   * Add or remove an episode from favourites, keyed by its composite id.
   * Adding stamps `addedAt` with the current time; removing simply filters
   * the entry out.
   *
   * @param {Omit<FavouriteEntry, "id" | "addedAt">} episodeRef
   */
  const toggleFavourite = useCallback((episodeRef) => {
    const id = buildEpisodeId(episodeRef);

    setFavourites((prev) => {
      const exists = prev.some((entry) => entry.id === id);
      if (exists) return prev.filter((entry) => entry.id !== id);
      return [...prev, { ...episodeRef, id, addedAt: new Date().toISOString() }];
    });
  }, []);

  const value = useMemo(
    () => ({ favourites, isFavourite, toggleFavourite }),
    [favourites, isFavourite, toggleFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

/**
 * Access the favourites list and its mutators.
 *
 * @returns {{ favourites: Array<FavouriteEntry>, isFavourite: Function, toggleFavourite: Function }}
 */
export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}
