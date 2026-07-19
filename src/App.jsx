import { Routes, Route } from "react-router-dom";
import { AudioPlayerProvider, useAudioPlayer } from "./context/AudioPlayerContext.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";
import Header from "./components/Header/Header.jsx";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShowDetailPage from "./pages/ShowDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/**
 * Routed page content plus the fixed audio player bar. Split out from
 * `App` so it can read `useAudioPlayer()` to know whether to reserve
 * bottom padding for the player (only once an episode has been selected).
 *
 * @returns {JSX.Element}
 */
function AppShell() {
  const { episode } = useAudioPlayer();

  return (
    <>
      <Header />
      <main className={`app-main${episode ? " app-main--with-player" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:showId" element={<ShowDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <AudioPlayer />
    </>
  );
}

/**
 * Application root: wires up the global providers (audio player,
 * favourites) that need to live above the router so their state survives
 * navigation between pages, then renders the shell.
 *
 * Routes:
 *  - `/`             → HomePage (listing, hero, search/filter/sort/pagination, quick-view modal)
 *  - `/show/:showId` → ShowDetailPage (dynamic per-show detail route with season/episode browsing)
 *  - `*`             → NotFoundPage
 *
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <AudioPlayerProvider>
      <FavouritesProvider>
        <AppShell />
      </FavouritesProvider>
    </AudioPlayerProvider>
  );
}
