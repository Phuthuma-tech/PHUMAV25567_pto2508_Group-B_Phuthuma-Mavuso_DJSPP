import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Carousel.css";

/**
 * Horizontally scrollable "Recommended for you" carousel. Uses native
 * scroll-snap for swipe/touch/trackpad scrolling, plus prev/next arrow
 * buttons that scroll one viewport's worth at a time and loop back to
 * the opposite end once they run out of room.
 *
 * @param {{ shows: Array<Object> }} props
 * @param {Array<Object>} props.shows - Shows to display, each enriched with `genreTitles`.
 * @returns {JSX.Element|null}
 */
export default function Carousel({ shows }) {
  const trackRef = useRef(null);

  if (!shows?.length) return null;

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const amount = track.clientWidth * 0.9 * direction;
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    if (direction > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="carousel" aria-label="Recommended shows">
      <div className="carousel__header">
        <h2 className="carousel__heading">Recommended for you</h2>
        <div className="carousel__arrows">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll recommendations left"
          >
            ←
          </button>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll recommendations right"
          >
            →
          </button>
        </div>
      </div>

      <ul className="carousel__track" ref={trackRef}>
        {shows.map((show) => (
          <li key={show.id} className="carousel__item">
            <Link to={`/show/${show.id}`} className="carousel__card">
              <img src={show.image} alt="" className="carousel__image" loading="lazy" />
              <div className="carousel__card-body">
                <h3 className="carousel__title">{show.title}</h3>
                {show.genreTitles?.length > 0 && (
                  <ul className="carousel__genres">
                    {show.genreTitles.slice(0, 2).map((title) => (
                      <li key={title} className="carousel__genre-tag">
                        {title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
