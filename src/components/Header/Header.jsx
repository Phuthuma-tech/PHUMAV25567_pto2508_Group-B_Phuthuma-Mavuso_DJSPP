import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import "./Header.css";

/**
 * Persistent site header. The logo links back to the bare homepage root;
 * in-page "back to shows" links (which preserve filters) live on the show
 * detail page instead, so this header stays simple and predictable. A
 * Favourites nav link is highlighted via NavLink's active state so users
 * always know which page they're on.
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

        <nav className="site-header__nav" aria-label="Primary">
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              `site-header__nav-link${isActive ? " site-header__nav-link--active" : ""}`
            }
          >
            Favourites
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
