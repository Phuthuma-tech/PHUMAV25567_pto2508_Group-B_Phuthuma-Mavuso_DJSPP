import { useFavourites } from "../../context/FavouritesContext.jsx";
import { buildEpisodeId } from "../../context/AudioPlayerContext.jsx";
import "./FavouriteButton.css";

/**
 * Heart-icon toggle for favouriting/unfavouriting a single episode.
 * Renders filled when the episode is already a favourite, outlined
 * otherwise, per the "visual feedback" user story.
 *
 * @param {{ episodeRef: Object }} props
 * @param {Object} props.episodeRef - Episode plus show/season context (see FavouritesContext).
 * @returns {JSX.Element}
 */
export default function FavouriteButton({ episodeRef }) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const id = buildEpisodeId(episodeRef);
  const favourited = isFavourite(id);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavourite(episodeRef);
  };

  return (
    <button
      type="button"
      className={`favourite-button${favourited ? " favourite-button--active" : ""}`}
      onClick={handleClick}
      aria-pressed={favourited}
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
      title={favourited ? "Remove from favourites" : "Add to favourites"}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          d="M12 20.5s-7.5-4.6-10-9.2C.4 8.1 2 4.5 5.6 4c2.1-.3 4 .8 6.4 3.3C14.4 4.8 16.3 3.7 18.4 4c3.6.5 5.2 4.1 3.6 7.3-2.5 4.6-10 9.2-10 9.2Z"
          fill={favourited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
