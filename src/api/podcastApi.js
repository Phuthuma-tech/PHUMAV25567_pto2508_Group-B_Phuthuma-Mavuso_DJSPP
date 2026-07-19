/**
 * @file podcastApi.js
 * Centralised data-access layer for the Podcast API. Every network call in
 * the app — the homepage preview list, a show's full detail (used by both
 * the routed detail page and the quick-view modal) — is funnelled through
 * this module so that endpoints, error handling, and response shapes stay
 * in one place.
 */

const BASE_URL = "https://podcast-api.netlify.app";

/**
 * Perform a fetch against the Podcast API and normalise failure handling.
 *
 * @param {string} url - Fully-qualified URL to request.
 * @returns {Promise<any>} Parsed JSON payload.
 * @throws {Error} If the network request fails or the response is not OK.
 */
async function request(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    throw new Error(
      "We couldn't reach the podcast service. Check your connection and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `The podcast service responded with an error (status ${response.status}).`
    );
  }

  return response.json();
}

/**
 * Fetch the full list of show previews used on the homepage/listing page.
 *
 * @returns {Promise<Array<Object>>} Array of PREVIEW objects.
 */
export function fetchAllPreviews() {
  return request(`${BASE_URL}`);
}

/**
 * Fetch a single genre's full record, including the show ids that belong to it.
 *
 * @param {number|string} genreId - Numeric id of the genre (1-9).
 * @returns {Promise<Object>} GENRE object.
 */
export function fetchGenre(genreId) {
  return request(`${BASE_URL}/genre/${genreId}`);
}

/**
 * Fetch the full detail record for a single show, including its embedded
 * seasons and episodes. Used by both the `/show/:showId` route and the
 * quick-view modal.
 *
 * @param {string|number} showId - Unique id of the show.
 * @returns {Promise<Object>} SHOW object with `seasons` array embedded.
 */
export function fetchShowById(showId) {
  return request(`${BASE_URL}/id/${showId}`);
}
