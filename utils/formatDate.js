/**
 * @file formatDate.js
 * Helpers for turning raw API date strings into human-readable text.
 */

/**
 * Format an ISO date string as a friendly "Month D, YYYY" date, e.g. "3 June 2026".
 * Used on show cards and the full show-detail page.
 *
 * @param {string} isoString - Raw date string from the API (e.g. show.updated).
 * @returns {string} Formatted, human-readable date, or a fallback string if invalid.
 */
export function formatUpdatedDate(isoString) {
  if (!isoString) return "Unknown";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Convert an ISO date string into a human-readable relative time string,
 * e.g. "Today", "3 days ago", "2 months ago". Used in the quick-view modal
 * alongside the short date for an at-a-glance sense of recency.
 *
 * @param {string} isoString - A valid ISO 8601 date string.
 * @returns {string} A relative time string.
 */
export function formatRelativeDate(isoString) {
  if (!isoString) return "Unknown";

  const now = new Date();
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
}

/**
 * Format an ISO date string as a localised date and time, e.g.
 * "15 Mar 2024, 14:32" — used to show when an episode was favourited.
 *
 * @param {string} isoString - A valid ISO 8601 date string.
 * @returns {string} A localised date + time string.
 */
export function formatDateTime(isoString) {
  if (!isoString) return "Unknown";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

/**
 * Format an ISO date string into a short localised date, e.g. "15 Mar 2024".
 *
 * @param {string} isoString - A valid ISO 8601 date string.
 * @returns {string} A localised short date string.
 */
export function formatShortDate(isoString) {
  if (!isoString) return "Unknown";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
