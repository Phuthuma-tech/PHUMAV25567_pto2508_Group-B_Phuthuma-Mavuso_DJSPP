import "./Hero.css";

/**
 * Homepage hero/intro banner, carried over from DJS03's landing page.
 * Purely presentational — sits above the search/filter toolbar.
 *
 * @returns {JSX.Element}
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="App introduction">
      <p className="hero__eyebrow">Discover · Listen · Explore</p>
      <h1 className="hero__title">
        Your next favourite
        <br />
        podcast is here.
      </h1>
      <p className="hero__subtitle">
        Browse hundreds of shows across comedy, history, fiction, and more —
        updated daily.
      </p>
    </section>
  );
}
