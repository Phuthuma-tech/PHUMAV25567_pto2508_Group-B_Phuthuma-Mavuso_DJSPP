import { truncateText } from "../../utils/text.js";
import { useAudioPlayer, buildEpisodeId } from "../../context/AudioPlayerContext.jsx";
import FavouriteButton from "../FavouriteButton/FavouriteButton.jsx";
import ProgressIndicator from "../ProgressIndicator/ProgressIndicator.jsx";
import "./EpisodeCard.css";

/**
 * A single episode row: number, season image, title, description, a
 * play/pause control wired to the global audio player, and a favourite
 * toggle. `show` and `season` context is required so the episode can be
 * uniquely identified and displayed correctly in the player bar and the
 * favourites page.
 *
 * @param {{
 *   episode: Object,
 *   number: number,
 *   image: string,
 *   show: { id: string|number, title: string },
 *   season: { number: number, title: string },
 * }} props
 * @returns {JSX.Element}
 */
export default function EpisodeCard({ episode, number, image, show, season }) {
  const { episode: currentEpisode, isPlaying, progress, playEpisode, togglePlay } = useAudioPlayer();

  const episodeRef = {
    showId: show.id,
    showTitle: show.title,
    seasonNumber: season.number,
    seasonTitle: season.title,
    episodeNumber: episode.episode ?? number,
    episodeTitle: episode.title,
    episodeDescription: episode.description,
    image,
    file: episode.file,
  };

  const id = buildEpisodeId(episodeRef);
  const isCurrent = currentEpisode?.id === id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episodeRef);
    }
  };

  return (
    <li className="episode-card">
      <span className="episode-card__number" aria-hidden="true">
        {String(number).padStart(2, "0")}
      </span>

      <button
        type="button"
        className="episode-card__play"
        onClick={handlePlayClick}
        aria-label={isCurrentlyPlaying ? `Pause ${episode.title}` : `Play ${episode.title}`}
      >
        {isCurrentlyPlaying ? "❚❚" : "▶"}
      </button>

      <img src={image} alt="" className="episode-card__image" loading="lazy" />

      <div className="episode-card__body">
        <h4 className="episode-card__title">{episode.title}</h4>
        <p className="episode-card__description">{truncateText(episode.description, 140)}</p>
        <ProgressIndicator entry={progress[id]} />
      </div>

      <FavouriteButton episodeRef={episodeRef} />
    </li>
  );
}
