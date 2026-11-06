# Design: Mobile market dashboard

## Context
Static page, public repo, Netlify hosting, no backend and no secrets. All data sources were checked
on 2026-11-06 and send `Access-Control-Allow-Origin: *`.

## Decisions

### Data sources
| Asset | Source | Why |
|---|---|---|
| Bitcoin USD/EUR | CoinGecko `market_chart` (365 days, daily) | Free, keyless, CORS, history included |
| Gold | CoinGecko `pax-gold` (PAXG, 1 token = 1 oz) | No free keyless CORS spot-metal API with history |
| Silver | CoinGecko `kinesis-silver` (KAG, 1 token = 1 oz) | Same as gold |
| ETF | onvista `GET https://api.onvista.de/api/v1/funds/ISIN:IE00BK5BQT80/snapshot` | Yahoo/Stooq have no CORS or block bots |

Rejected alternatives:
- Yahoo Finance chart API: no CORS, HTTP 429.
- Stooq CSV: bot-check page instead of data.
- gold-api.com: keyless and CORS, but current USD price only, no history.
- Swissquote quote feed: current XAU/EUR only, no history.
- onvista `chart_history`: HTTP 403 with a link to their terms of use — do not use.
- Backend/proxy: not needed now. If a licensed source is needed later, prefer a scheduled GitHub
  Action that writes a JSON file into the repo.

### API details
CoinGecko `market_chart` returns `{ "prices": [[timestampMs, price], ...] }`, ascending. With
`interval=daily` the points are at 00:00 UTC and the **last point is the live price**. Use it as the
current price and timestamp, so no extra `simple/price` call is needed (4 CoinGecko requests per
refresh).

onvista snapshot fields:
- `quote.last` — current price
- `quote.isoCurrency` — `"EUR"`
- `quote.datetimeLast` — ISO timestamp
- `cnPerformance.performanceRelW1` — 1-week change in %
- `cnPerformance.performanceRelW4` — 4-week change in %
- `cnPerformance.performanceRelCy` — year-to-date change in %

onvista only provides 4 weeks (not 31 days), so "4 W" = 28 days for all assets.

### Normalized quote
```js
{ currency: 'EUR', current: 67134.2, updated: 1793951706323, w1: -3.2, w4: -11.8, ytd: -9.92 }
```
`w1`, `w4`, `ytd` are percentages or `null`.

### Calculation helpers
```js
// Last price at or before the given timestamp; prices are [timestamp, price] sorted ascending.
function priceAt(prices, timestamp) { ... }
function change(current, past) { return past ? (current / past - 1) * 100 : null; }
// YTD reference: priceAt(prices, Date.UTC(year, 0, 1)), year = UTC year of the last point.
```

### UI state and rendering
- State: `view` (`'current' | 'w1' | 'w4' | 'ytd'`), `results` (per tile `{ quote }` or `{ error }`),
  `lastLoad`.
- Tile shells (logo, name, subtitle) are created once; only the tile body is re-rendered.
- Switching the view calls `render()` only; `refresh()` fetches via `Promise.allSettled`, then renders.
- `setInterval(refresh, 5 min)` plus a `visibilitychange` handler (mobile browsers pause timers in
  background tabs).

### Visual design
- Dark theme: background `#0f1115`, cards `#181b22`, borders `#262a33`, text `#e6e8ec`, muted
  `#8b919c`, gains `#2fbf71`, losses `#e5534b`.
- Segmented control: 4 equal columns in a rounded card; selected button light with dark text.
- Tiles: `grid-template-columns: repeat(2, minmax(0, 1fr))`, 12 px gap, 14 px radius; header row with
  32 px logo + name/subtitle; big value (`clamp(1.25rem, 6vw, 1.75rem)`, tabular numbers, `nowrap`)
  pushed to the bottom; small muted detail line below.
- `viewport-fit=cover` and `env(safe-area-inset-*)` padding for notched phones.

### Netlify
The page lives at the repository root:
```toml
[build]
  publish = "."
  command = ""
```
Optional: `[[headers]]` with a short `Cache-Control` for JS/CSS and a `Content-Security-Policy` whose
`connect-src` allows `api.coingecko.com` and `api.onvista.de`.

## Risks / Trade-offs
- CoinGecko rate limit (HTTP 429) on frequent reloads or shared IPs → tile shows an error until the
  next refresh.
- onvista may change or block the snapshot endpoint → only the ETF tile breaks.
- Token prices (PAXG, KAG) can deviate slightly from spot.
- CoinGecko public history is capped at 365 days; YTD always fits.

## Open Questions
- Remember the selected view (localStorage or URL hash)? Not required now.
