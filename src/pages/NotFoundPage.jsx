import { Link } from "react-router-dom";
import { EmptyState } from "../components/StatusStates/StatusStates.jsx";

/**
 * Fallback page rendered for any unmatched route.
 *
 * @returns {JSX.Element}
 */
export default function NotFoundPage() {
  return (
    <>
      <EmptyState title="Page not found" message="Let's get you back to the shows." />
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link to="/">← Back to shows</Link>
      </p>
    </>
  );
}
