/**
 * @file shuffle.js
 * Fisher-Yates shuffle, used to pick a randomised "recommended shows"
 * selection for the homepage carousel without mutating the source array.
 */

/**
 * Return a new array containing the same items in random order.
 *
 * @param {Array<*>} items - Source array (not mutated).
 * @returns {Array<*>} A new, shuffled array.
 */
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
