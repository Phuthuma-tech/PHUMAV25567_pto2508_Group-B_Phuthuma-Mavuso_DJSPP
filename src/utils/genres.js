/**
 * @file genres.js
 * Static lookup table mapping genre ids (as returned on PREVIEW/SHOW
 * objects) to their human-readable titles. The API only exposes genre
 * ids on previews, so this mapping is maintained locally.
 */

/** @type {Record<number, string>} */
export const GENRE_TITLES = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family",
};

/**
 * Resolve an array of genre ids to their display titles.
 *
 * @param {Array<number>} [genreIds] - Genre ids from a PREVIEW or SHOW object.
 * @returns {Array<string>} Titles for each recognised id (unknown ids are skipped).
 */
export function getGenreTitles(genreIds = []) {
  return genreIds
    .map((id) => GENRE_TITLES[id])
    .filter((title) => Boolean(title));
}
