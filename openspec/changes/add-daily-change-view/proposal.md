# Change: Daily views "Heute" and "T-1" instead of "Aktuell"

## Why
The most common question is how things are doing today and how they did yesterday. A view that only
shows prices is not needed: the current price is already shown under every percentage.

## What Changes
- **BREAKING (UI):** remove the "Aktuell" view. The views are now "Heute", "T-1", "7 T", "4 W"
  and "YTD"; "Heute" is selected on page load.
- "Heute": change since the previous close (T-1). CoinGecko assets compare with the 00:00 UTC point of
  the current day; the ETF and indices use onvista `quote.performancePct`.
- "T-1": the previous day's change (T-1 close against T-2 close). CoinGecko assets compare the
  00:00 UTC points of today and yesterday; the ETF and indices use onvista
  `cnPerformance.performanceRelD1`.
- The quote timestamp ("Stand …") is no longer shown, and `updated` is dropped from the normalized
  quote. The footer keeps "Zuletzt geladen".
- View button labels do not wrap.
- No additional requests.

## Impact
- Affected specs: `market-dashboard`
- Affected code: `index.html`, `style.css`, `app.js`, `README.md`, screenshots
