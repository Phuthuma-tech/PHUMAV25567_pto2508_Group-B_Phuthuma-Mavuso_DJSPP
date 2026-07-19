/**
 * @file storage.js
 * Small, defensive wrappers around localStorage. Every read/write is
 * try/caught so a private-browsing session (or a full/blocked storage
 * quota) degrades to "nothing persists" instead of crashing the app.
 */

/**
 * Read and JSON-parse a value from localStorage.
 *
 * @param {string} key - Storage key.
 * @param {*} fallback - Value returned if the key is missing or unreadable.
 * @returns {*} Parsed value, or `fallback`.
 */
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

/**
 * JSON-stringify and write a value to localStorage.
 *
 * @param {string} key - Storage key.
 * @param {*} value - Value to persist (must be JSON-serialisable).
 * @returns {boolean} Whether the write succeeded.
 */
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}
