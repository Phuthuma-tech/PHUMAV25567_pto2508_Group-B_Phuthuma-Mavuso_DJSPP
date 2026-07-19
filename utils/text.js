/**
 * @file text.js
 * Small text-shaping helpers shared across components.
 */

/**
 * Strip any embedded HTML tags from an API description string.
 *
 * @param {string} html - Raw description that may contain markup.
 * @returns {string} Plain text with tags removed.
 */
export function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Shorten a block of text to a maximum character length, breaking on a
 * whole word and appending an ellipsis when truncation occurs.
 *
 * @param {string} text - Source text (may contain HTML, which is stripped first).
 * @param {number} [maxLength=120] - Maximum number of characters to keep.
 * @returns {string} Shortened, plain-text description.
 */
export function truncateText(text = "", maxLength = 120) {
  const plain = stripHtml(text).trim();
  if (plain.length <= maxLength) return plain;

  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}
