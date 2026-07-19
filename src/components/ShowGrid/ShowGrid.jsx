import ShowCard from "../ShowCard/ShowCard.jsx";
import "./ShowGrid.css";

/**
 * Responsive grid of show preview cards.
 *
 * @param {{ shows: Array<Object>, onQuickView?: (showId: string|number) => void }} props
 * @returns {JSX.Element}
 */
export default function ShowGrid({ shows, onQuickView }) {
  return (
    <ul className="show-grid">
      {shows.map((show) => (
        <li key={show.id}>
          <ShowCard show={show} onQuickView={onQuickView} />
        </li>
      ))}
    </ul>
  );
}
