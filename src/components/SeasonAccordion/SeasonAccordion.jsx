import { useState } from "react";
import EpisodeCard from "../EpisodeCard/EpisodeCard.jsx";
import "./SeasonAccordion.css";

/**
 * Expand/collapse list of seasons. Only one season is expanded at a time,
 * so users can switch between seasons without scrolling through every
 * episode in the show at once.
 *
 * @param {{ seasons: Array<Object> }} props
 * @param {Array<Object>} props.seasons - SEASON objects, each with an `episodes` array.
 * @returns {JSX.Element}
 */
export default function SeasonAccordion({ seasons }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <ul className="season-accordion">
      {seasons.map((season, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <li key={season.season ?? index} className="season-accordion__item">
            <button
              type="button"
              className="season-accordion__header"
              aria-expanded={isExpanded}
              onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
            >
              <img
                src={season.image}
                alt=""
                className="season-accordion__thumb"
                loading="lazy"
              />
              <span className="season-accordion__heading">
                <span className="season-accordion__title">{season.title}</span>
                <span className="season-accordion__count">
                  {season.episodes.length}{" "}
                  {season.episodes.length === 1 ? "episode" : "episodes"}
                </span>
              </span>
              <span className="season-accordion__chevron" aria-hidden="true">
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            {isExpanded && (
              <ul className="season-accordion__episodes">
                {season.episodes.map((episode, episodeIndex) => (
                  <EpisodeCard
                    key={episode.episode ?? episodeIndex}
                    episode={episode}
                    number={episodeIndex + 1}
                    image={season.image}
                  />
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
