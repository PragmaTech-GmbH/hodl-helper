# Project Context

## Purpose
hodl-helper is a public, static, mobile-first web page that shows current prices and recent
performance for a small personal watchlist: Bitcoin (USD and EUR), gold and silver (EUR per troy
ounce), the Vanguard FTSE All-World UCITS ETF (EUR) and the DAX, S&P 500 and EURO STOXX 50 indices
(points). It is deployed to Netlify.

## Tech Stack
- Plain HTML, CSS and vanilla JavaScript (ES2022). No framework, no bundler, no build step, no npm
  runtime dependencies.
- Data is fetched directly from the browser from public, CORS-enabled APIs (no backend, no API keys).
- Hosting: Netlify, serving the repository root as-is.

## Project Conventions

### Code Style
- Three files: `index.html`, `style.css`, `app.js`. `'use strict';` at the top of `app.js`.
- Small pure functions for data loading and formatting; one `render()` that redraws from state.
- Numbers and dates formatted with `Intl` / `toLocaleString` using the `de-DE` locale.
- UI text is German.

### Architecture Patterns
- Configuration-driven: a `TILES` array describes each tile (name, subtitle, logo, loader).
- Each loader returns a normalized quote object (see design.md). Rendering never touches raw API shapes.
- A failing data source only breaks its own tile (`Promise.allSettled`).

### Testing Strategy
- Playwright tests in `tests/` (own `package.json` with `@playwright/test` as the only dev dependency;
  the page itself stays free of npm dependencies). They run in Chromium at iPhone 13 size.
- External APIs are always stubbed (`tests/fixtures.js`); any other request leaving localhost is aborted.
  The browser clock is pinned to 2026-11-06T12:00Z, so expected values are exact.
- `helpers.spec.js` calls the pure helpers (`priceAt`, `change`, `formatPrice`, `formatChange`) in the
  page; `dashboard.spec.js` covers views, error isolation per source and the CoinGecko cache.
- GitHub Actions runs the suite on every pull request and on pushes to `main`.

### Git Workflow
- Feature branches and pull requests against `main`.

## Domain Context
- "YTD" = change since the last price of the previous calendar year (UTC).
- "Heute" = change since the previous close (T-1): 00:00 UTC for crypto and token prices, the previous
  trading day's close for the ETF and indices.
- "T-1" = the previous day's change: previous close (T-1) against the close before it (T-2).
- "7 T" = 7 days, "4 W" = 4 weeks (28 days).
- Gold and silver are tracked through gold- and silver-backed tokens (1 token = 1 troy ounce), because
  no free, keyless, CORS-enabled spot metal API with history was found. The token price is within
  ~0.1–0.5 % of spot.

## Important Constraints
- Must work without a backend and without secrets (repository is public).
- CoinGecko public API: no key, history limited to the last 365 days, rate limit of a few requests per
  minute (HTTP 429 after roughly 5 quick requests). Keep CoinGecko requests per refresh small
  (currently 4), refresh no more than every 5 minutes, and cache responses in `localStorage` for 4 minutes
  so that reloads do not refetch.
- onvista's API is undocumented and may change. Its terms restrict content usage; the price-history
  endpoint returns HTTP 403 and must not be used. Only the snapshot endpoint is used. Acceptable for a
  personal dashboard; the page credits onvista and states "Keine Anlageberatung".

## External Dependencies
- CoinGecko public API v3 — `https://api.coingecko.com/api/v3` (`Access-Control-Allow-Origin: *`).
- onvista API — `https://api.onvista.de/api/v1` (`Access-Control-Allow-Origin: *`).
- Netlify for hosting.
