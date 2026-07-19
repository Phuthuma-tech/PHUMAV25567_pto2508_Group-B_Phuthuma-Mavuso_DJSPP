import { useAudioPlayer } from "../../context/AudioPlayerContext.jsx";
import "./AudioPlayer.css";

/**
 * Format seconds as `M:SS` (or `H:MM:SS` past an hour).
 *
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const paddedSecs = String(secs).padStart(2, "0");
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${paddedSecs}`;
  return `${mins}:${paddedSecs}`;
}

/**
 * Fixed-bottom, always-mounted audio player bar. Shows the current
 * episode's artwork/title/show, play/pause, a seek slider with elapsed
 * and total time, and any load/playback error. Renders `null` (but stays
 * mounted, via the parent `AudioPlayerProvider`) when no episode has been
 * selected yet, so it never covers page content before there's anything
 * to control.
 *
 * @returns {JSX.Element|null}
 */
export default function AudioPlayer() {
  const { episode, isPlaying, currentTime, duration, error, togglePlay, seek } = useAudioPlayer();

  if (!episode) return null;

  return (
    <div className="audio-player" role="region" aria-label="Audio player">
      <div className="audio-player__track">
        <img src={episode.image} alt="" className="audio-player__art" />
        <div className="audio-player__meta">
          <p className="audio-player__title">{episode.episodeTitle}</p>
          <p className="audio-player__subtitle">
            {episode.showTitle} · {episode.seasonTitle}
          </p>
        </div>
      </div>

      <div className="audio-player__controls">
        <button
          type="button"
          className="audio-player__play"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <span className="audio-player__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="audio-player__seek"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek"
        />
        <span className="audio-player__time">{formatTime(duration)}</span>
      </div>

      {error && (
        <p className="audio-player__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
