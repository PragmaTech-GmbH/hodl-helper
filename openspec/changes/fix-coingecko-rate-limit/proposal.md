# Change: Cache CoinGecko responses to avoid rate limiting

## Why
The CoinGecko public API answers with HTTP 429 after only a handful of requests per minute from one IP.
Each page load sends 4 CoinGecko requests, so reloading the page two or three times (for example while
checking a deploy preview) leaves the Bitcoin, gold and silver tiles showing "Nicht verfügbar". The 429
response has no CORS header, so the browser only reports a generic network error.

## What Changes
- Cache each CoinGecko `market_chart` response in `localStorage` for 4 minutes (just under the 5-minute
  refresh interval). Reloads within that window send no CoinGecko requests; the automatic refresh still
  fetches fresh data.
- Show "nicht erreichbar oder Limit erreicht" instead of the browser's network error text.
- Rejected: one `simple/price` request for all live prices plus a once-a-day history cache. CoinGecko
  converts to EUR at a different rate there than in `market_chart` (about 0.5 % apart on 2026-11-06),
  which skewed the EUR changes.

## Impact
- Affected specs: `market-dashboard`
- Affected code: `app.js`
