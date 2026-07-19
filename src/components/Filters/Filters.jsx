import { GENRE_TITLES } from "../../utils/genres.js";
import "./Filters.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Recently updated" },
  { value: "oldest", label: "Least recently updated" },
  { value: "az", label: "Title A–Z" },
  { value: "za", label: "Title Z–A" },
];

/**
 * Controls for searching, filtering by genre, and sorting the show list,
 * plus a live results count and "Clear filters" reset action (both carried
 * over from DJS04's Toolbar). All values are lifted state, driven by
 * `useShowListQuery`, so they stay in sync with the URL and survive
 * navigation to a show and back.
 *
 * @param {{
 *   search: string,
 *   genre: string,
 *   sort: string,
 *   resultCount: number,
 *   hasActiveFilters: boolean,
 *   onSearchChange: (value: string) => void,
 *   onGenreChange: (value: string) => void,
 *   onSortChange: (value: string) => void,
 *   onReset: () => void,
 * }} props
 * @returns {JSX.Element}
 */
export default function Filters({
  search,
  genre,
  sort,
  resultCount,
  hasActiveFilters,
  onSearchChange,
  onGenreChange,
  onSortChange,
  onReset,
}) {
  return (
    <section className="filters" aria-label="Search, filter and sort podcasts">
      <div className="filters__row">
        <label className="filters__search">
          <span className="visually-hidden">Search shows by title</span>
          <svg
            className="filters__search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search shows…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <label className="filters__field">
          <span className="filters__label">Genre</span>
          <select value={genre} onChange={(event) => onGenreChange(event.target.value)}>
            <option value="all">All genres</option>
            {Object.entries(GENRE_TITLES).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>

        <label className="filters__field">
          <span className="filters__label">Sort</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters && (
          <button type="button" className="filters__reset" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>

      <p className="filters__count" role="status" aria-live="polite">
        {resultCount} show{resultCount !== 1 ? "s" : ""} found
      </p>
    </section>
  );
}
