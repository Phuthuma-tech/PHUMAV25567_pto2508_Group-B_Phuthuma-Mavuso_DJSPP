import "./ProgressIndicator.css";

/**
 * Renders a "Finished" badge, an in-progress percentage bar, or nothing
 * (never started), based on a saved progress entry from
 * `AudioPlayerContext`'s `progress` map.
 *
 * @param {{ entry: { position: number, duration: number, finished: boolean } | undefined }} props
 * @returns {JSX.Element|null}
 */
export default function ProgressIndicator({ entry }) {
  if (!entry) return null;

  if (entry.finished) {
    return <span className="progress-indicator progress-indicator--finished">Finished</span>;
  }

  if (!entry.duration || entry.position <= 0) return null;

  const percent = Math.min(100, Math.round((entry.position / entry.duration) * 100));
  if (percent <= 0) return null;

  return (
    <span className="progress-indicator" title={`${percent}% played`}>
      <span className="progress-indicator__track">
        <span className="progress-indicator__fill" style={{ width: `${percent}%` }} />
      </span>
      <span className="progress-indicator__label">{percent}%</span>
    </span>
  );
}
