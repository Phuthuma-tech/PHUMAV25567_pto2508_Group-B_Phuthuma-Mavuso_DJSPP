import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFavourites } from "../context/FavouritesContext.jsx";
import { useAudioPlayer } from "../context/AudioPlayerContext.jsx";
import FavouriteButton from "../components/FavouriteButton/FavouriteButton.jsx";
import ProgressIndicator from "../components/ProgressIndicator/ProgressIndicator.jsx";
import { EmptyState } from "../components/StatusStates/StatusStates.jsx";
import { formatDateTime } from "../utils/formatDate.js";
import "./FavouritesPage.css";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest added" },
  { value: "date-asc", label: "Oldest added" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

/**
 * Sort a list of favourite entries in place-safe fashion.
 *
 * @param {Array<Object>} entries
 * @param {string} sortOption - One of SORT_OPTIONS' values.
 * @returns {Array<Object>} A new, sorted array.
 */
function sortEntries(entries, sortOption) {
  const sorted = [...entries];
  switch (sortOption) {
    case "title-asc":
      sorted.sort((a, b) => a.episodeTitle.localeCompare(b.episodeTitle));
      break;
    case "title-desc":
      sorted.sort((a, b) => b.episodeTitle.localeCompare(a.episodeTitle));
      break;
    case "date-asc":
      sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      break;
    case "date-desc":
    default:
      sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      break;
  }
  return sorted;
}

/**
 * Group favourite entries by their show title, sort within each group per
 * the chosen sort option, and return the groups themselves sorted
 * alphabetically by show title for a stable, scannable page layout.
 *
 * @param {Array<Object>} favourites
 * @param {string} sortOption
 * @returns {Array<{ showTitle: string, entries: Array<Object> }>}
 */
function groupFavourites(favourites, sortOption) {
  const groups = new Map();

  for (const entry of favourites) {
    const list = groups.get(entry.showTitle) ?? [];
    list.push(entry);
    groups.set(entry.showTitle, list);
  }

  return Array.from(groups.entries())
    .map(([showTitle, entries]) => ({ showTitle, entries: sortEntries(entries, sortOption) }))
    .sort((a, b) => a.showTitle.localeCompare(b.showTitle));
}

/**
 * Displays every favourited episode, grouped by show, with sorting by
 * title or by the date/time each episode was added. Each row shows the
 * associated season, when it was favourited, and lets the user play the
 * episode directly or remove it from favourites.
 *
 * @returns {JSX.Element}
 */
export default function FavouritesPage() {
  const { favourites } = useFavourites();
  const { episode: currentEpisode, isPlaying, progress, playEpisode, togglePlay, resetProgress } =
    useAudioPlayer();
  const [sortOption, setSortOption] = useState("date-desc");

  const groups = useMemo(() => groupFavourites(favourites, sortOption), [favourites, sortOption]);

  if (favourites.length === 0) {
    return (
      <section>
        <h1 className="favourites-page__heading">Favourites</h1>
        <EmptyState
          title="No favourites yet"
          message="Tap the heart icon on any episode to save it here."
        />
        <div className="favourites-page__footer">
          <button
            type="button"
            className="favourites-page__reset"
            onClick={() => {
              if (window.confirm("Reset all listening progress? This can't be undone.")) {
                resetProgress();
              }
            }}
          >
            Reset listening history
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="favourites-page__header">
        <h1 className="favourites-page__heading">Favourites</h1>

        <label className="favourites-page__sort">
          <span className="visually-hidden">Sort favourites</span>
          <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {groups.map((group) => (
        <div key={group.showTitle} className="favourites-group">
          <h2 className="favourites-group__title">
            <Link to={`/show/${group.entries[0].showId}`}>{group.showTitle}</Link>
            <span className="favourites-group__count">({group.entries.length})</span>
          </h2>

          <ul className="favourites-group__list">
            {group.entries.map((entry) => {
              const isCurrent = currentEpisode?.id === entry.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;

              return (
                <li key={entry.id} className="favourite-row">
                  <button
                    type="button"
                    className="favourite-row__play"
                    onClick={() => (isCurrent ? togglePlay() : playEpisode(entry))}
                    aria-label={isCurrentlyPlaying ? `Pause ${entry.episodeTitle}` : `Play ${entry.episodeTitle}`}
                  >
                    {isCurrentlyPlaying ? "❚❚" : "▶"}
                  </button>

                  <img src={entry.image} alt="" className="favourite-row__image" loading="lazy" />

                  <div className="favourite-row__body">
                    <p className="favourite-row__title">{entry.episodeTitle}</p>
                    <p className="favourite-row__meta">
                      Season {entry.seasonNumber}: {entry.seasonTitle}
                    </p>
                    <p className="favourite-row__added">Added {formatDateTime(entry.addedAt)}</p>
                    <ProgressIndicator entry={progress[entry.id]} />
                  </div>

                  <FavouriteButton episodeRef={entry} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="favourites-page__footer">
        <button
          type="button"
          className="favourites-page__reset"
          onClick={() => {
            if (window.confirm("Reset all listening progress? This can't be undone.")) {
              resetProgress();
            }
          }}
        >
          Reset listening history
        </button>
      </div>
    </section>
  );
}
