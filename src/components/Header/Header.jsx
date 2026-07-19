import { Link } from "react-router-dom";
import "./Header.css";

/**
 * Persistent site header. The logo links back to the bare homepage root;
 * in-page "back to shows" links (which preserve filters) live on the show
 * detail page instead, so this header stays simple and predictable.
 *
 * @returns {JSX.Element}
 */
export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true">
            ◐
          </span>
          <span className="site-header__wordmark">Podcast Explorer</span>
        </Link>
      </div>
    </header>
  );
}
