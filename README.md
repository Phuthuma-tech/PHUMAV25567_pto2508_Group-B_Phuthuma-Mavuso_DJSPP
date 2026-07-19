# Podcast Explorer — Unified

A single React + Vite application that merges **DJS03**, **DJS04**, and **DJS05**
into one codebase, keeping every distinct feature from all three.

## Why this structure

The three projects turned out to be three stages of the *same* app, each
adding a layer on top of the last:

- **DJS03** — fetch + render a grid, click a card → fetch full detail →
  show it in a **modal**. Genre filter, sort, hero section.
- **DJS04** — same idea, but with a real **search box**, a dedicated
  **Toolbar** (search + genre + sort + live result count + "Clear filters"),
  and **pagination** driven by a single `usePodcastExplorer` hook.
- **DJS05** — the most advanced version: search/genre/sort/pagination state
  lives in the **URL** (`useSearchParams`) instead of component state, and
  clicking a show navigates to a **dedicated `/show/:id` route** with a full
  season/episode accordion, instead of a modal.

Because DJS05 is architecturally a superset of DJS04 (URL state does
everything local state did, plus deep-linking and back-button support) and
DJS04 is a superset of DJS03 (search + pagination + toolbar polish on top of
the same fetch/filter/sort idea), **DJS05 was used as the base**. Nothing
from DJS04 or DJS03 needed reinventing — it needed porting onto the newer
foundation.

## What was merged in on top of the DJS05 base

| Feature | From | Where it lives now |
|---|---|---|
| URL-synced search / genre / sort / pagination | DJS05 | `hooks/useShowListQuery.js` |
| Routed show detail page + season/episode accordion | DJS05 | `pages/ShowDetailPage.jsx`, `components/SeasonAccordion`, `components/EpisodeCard` |
| sessionStorage "back to shows" (preserves filters) | DJS05 | `pages/HomePage.jsx` (`LAST_HOME_URL_KEY`) |
| Hero/intro banner | DJS03 | `components/Hero/Hero.jsx` |
| **Quick-view modal** (glance at a show without leaving the grid) | DJS03 | `hooks/useQuickView.js`, `components/QuickViewModal` |
| Relative + short date formatting for the modal | DJS03 | `utils/formatDate.js` (`formatRelativeDate`, `formatShortDate`) |
| Live "N shows found" result count | DJS04 | `components/Filters/Filters.jsx` |
| "Clear filters" reset button | DJS04 | `components/Filters/Filters.jsx`, `useShowListQuery().resetFilters` |
| Search input icon | DJS04 | `components/Filters/Filters.jsx` |

### The one deliberate behavior change

Each `ShowCard` now supports **two ways to open a show**:

- Clicking the card **navigates** to `/show/:id` — DJS05's full page, with
  the complete season/episode accordion.
- Hovering reveals a **"Quick view" button** that opens DJS03's modal
  in-place (no navigation), for a fast glance at the description, genres,
  and season count. The modal includes a link through to the full page.

This means no feature was dropped in the merge — DJS03's modal and DJS05's
routed page coexist, each doing the job it's best at.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Project layout

```
src/
  api/podcastApi.js          Single fetch layer (previews + show-by-id)
  utils/                     genres.js, formatDate.js, text.js
  hooks/
    useShowListQuery.js      URL-synced search/genre/sort/pagination (DJS05, extended)
    useShowDetail.js         Fetch a show for the routed detail page
    useQuickView.js          Fetch + open/close state for the quick-view modal
  components/
    Header/, Hero/, Filters/, ShowGrid/, ShowCard/, QuickViewModal/,
    Pagination/, StatusStates/, GenreTags/, SeasonAccordion/, EpisodeCard/
  pages/
    HomePage.jsx             Hero + Filters + grid + pagination + quick view
    ShowDetailPage.jsx       Full show page with season/episode accordion
    NotFoundPage.jsx
```

All components carry JSDoc comments, and the visual system (colors,
spacing, type) lives in `src/styles/tokens.css` so every screen — grid,
detail page, and modal — is styled consistently.
