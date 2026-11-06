## 1. Page
- [x] 1.1 `index.html`: German UI, viewport meta with `viewport-fit=cover`, sticky header with the four
      view buttons (`role="tab"`, `data-view="current|w1|w4|ytd"`), `<main id="tiles">`, footer with
      `#status`, attribution and disclaimer
- [x] 1.2 `style.css`: dark theme, segmented control, 2-column grid, tile layout, up/down colors,
      safe-area padding

## 2. Data and logic (`app.js`)
- [x] 2.1 `getJson(url)` that throws on non-2xx
- [x] 2.2 `priceAt` and `change` helpers
- [x] 2.3 `coinQuote(id, currency)` → normalized quote (w1 = 7 d, w4 = 28 d, ytd = since 1 Jan UTC)
- [x] 2.4 `onvistaQuote(kind, isin)` for the onvista snapshot (ETF and indices) → normalized quote
- [x] 2.5 `TILES` config with eight tiles and inline SVG logos
- [x] 2.6 Render current and period views, per-tile error state, "–" for missing values
- [x] 2.7 View switching without refetching; `aria-selected` in sync
- [x] 2.8 Refresh every 5 min and on `visibilitychange` when stale; "Zuletzt geladen" in the footer

## 3. Deployment and docs
- [x] 3.1 `netlify.toml` publishing the repository root with no build command
- [x] 3.2 README: what it shows, sources and limitations, local run (`python3 -m http.server 8000`),
      Netlify setup, screenshots
- [ ] 3.3 Connect the repo in Netlify; verify the deployed page loads data without CORS errors

## 4. Verification
- [x] 4.1 Check all four views at iPhone size (e.g. Playwright `devices['iPhone 13']`)
- [x] 4.2 Block `api.onvista.de` and check that only the ETF and index tiles show an error
- [ ] 4.3 Compare numbers against coingecko.com and onvista.de
