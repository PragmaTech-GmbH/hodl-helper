# Change: Add "Heute" view (change since yesterday)

## Why
The dashboard shows changes over 7 days, 4 weeks and the year, but not the most common question:
how is it doing today compared with yesterday (T-1)?

## What Changes
- A fifth button "Heute" between "Aktuell" and "7 T" that shows the change since the previous close
  for all tiles, with the detail line "seit gestern · <price>".
- CoinGecko assets: compared with the 00:00 UTC point of the current day (the previous day's close).
- ETF and indices: onvista `quote.performancePct` (change against `quote.previousLast`).
- No additional requests.

## Impact
- Affected specs: `market-dashboard`
- Affected code: `index.html`, `style.css`, `app.js`, `README.md`
