import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShowDetailPage from "./pages/ShowDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

/**
 * Application shell: persistent header plus the routed page content.
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
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/show/:showId" element={<ShowDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
