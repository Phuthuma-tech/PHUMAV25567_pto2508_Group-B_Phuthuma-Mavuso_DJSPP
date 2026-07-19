import { truncateText } from "../../utils/text.js";
import "./EpisodeCard.css";

/**
 * A single episode row: number, season image, title, and a shortened
 * description so the list can be scanned quickly.
 *
 * @param {{ episode: Object, number: number, image: string }} props
 * @param {Object} props.episode - EPISODE object (title, description, episode).
 * @param {number} props.number - Episode's position within its season (1-indexed).
 * @param {string} props.image - Season image, shown alongside every episode in it.
 * @returns {JSX.Element}
 */
export default function EpisodeCard({ episode, number, image }) {
  return (
    <li className="episode-card">
      <span className="episode-card__number" aria-hidden="true">
        {String(number).padStart(2, "0")}
      </span>
      <img src={image} alt="" className="episode-card__image" loading="lazy" />
      <div className="episode-card__body">
        <h4 className="episode-card__title">{episode.title}</h4>
        <p className="episode-card__description">{truncateText(episode.description, 140)}</p>
      </div>
    </li>
  );
}
