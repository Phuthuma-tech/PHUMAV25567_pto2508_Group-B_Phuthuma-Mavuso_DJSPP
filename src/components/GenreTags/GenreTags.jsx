import "./GenreTags.css";

/**
 * Render a row of genre tag pills.
 *
 * @param {{ titles: Array<string> }} props
 * @returns {JSX.Element|null}
 */
export default function GenreTags({ titles }) {
  if (!titles?.length) return null;

  return (
    <ul className="genre-tags">
      {titles.map((title) => (
        <li key={title} className="genre-tags__tag">
          {title}
        </li>
      ))}
    </ul>
  );
}
