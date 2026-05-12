## Goal

Replace the placeholder home page with the uploaded Kat Espinosa design — a single centered 491px column, Arial Bold + Times New Roman, with a "Fruits in season" list where hovering each fruit name reveals its inline SVG illustration to the right.

## Scope

Frontend-only change. No backend, no new dependencies.

## Files

- `src/routes/index.tsx` — replace `PlaceholderIndex` with the Kat Espinosa layout (name, bio bullets, Today section, Fruits in season, Interests, links). Inline the four SVGs (mango, santol, watermelon, sinigwelas) from the upload verbatim. Update `head()` with title "Kat Espinosa" and matching description.
- `src/styles.css` — append a scoped block of the design's CSS (column, name, bio, section, fruits hover-reveal, links). Keep all existing tokens and Tailwind setup untouched. Use plain CSS classes (not Tailwind utilities) so the brutalist styling matches the upload exactly. Times New Roman / Arial are system fonts — no font loading needed.

## Behavior

- Time/date: compute client-side via `Intl.DateTimeFormat` with `Asia/Manila`, refresh every 30s inside a `useEffect`.
- Weather + sunrise/sunset: fetch Open-Meteo on mount inside a `useEffect`; silently keep placeholder text on failure. No API key needed.
- Fruit hover: pure CSS (`:hover`/`:focus-within` on `.fruit-item` toggles `.fruit-img` opacity/transform). Keyboard accessible via `tabIndex={0}`.

## Out of scope

- Wiring the three footer links to real routes (kept as `#` like the source).
- Replacing inline SVGs with generated images — the design intentionally uses hand-drawn SVGs.
