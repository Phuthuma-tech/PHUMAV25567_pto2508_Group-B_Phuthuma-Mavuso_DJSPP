import "./StatusStates.css";

/**
 * Full-width loading indicator, used whenever the app is waiting on a
 * network request (preview list or a single show's detail).
 *
 * @param {{ label?: string }} props
 * @returns {JSX.Element}
 */
export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="status-state status-state--loading" role="status" aria-live="polite">
      <span className="status-state__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

/**
 * User-friendly error display with an optional retry action.
 *
 * @param {{ message: string, onRetry?: () => void }} props
 * @returns {JSX.Element}
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div className="status-state status-state--error" role="alert">
      <p className="status-state__title">Something went wrong</p>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="status-state__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * Empty-state placeholder, e.g. when a filtered list has no results or a
 * requested show could not be found.
 *
 * @param {{ title: string, message: string }} props
 * @returns {JSX.Element}
 */
export function EmptyState({ title, message }) {
  return (
    <div className="status-state status-state--empty">
      <p className="status-state__title">{title}</p>
      <p>{message}</p>
    </div>
  );
}
