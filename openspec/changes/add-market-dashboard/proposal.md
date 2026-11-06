# Change: Add mobile market dashboard

## Why
A quick, phone-friendly way to check how Bitcoin, gold, silver and a world-equity ETF are doing right
now and over the last week, the last four weeks and the year so far, without logging into a broker or
running a backend.

## What Changes
- Add a static landing page (`index.html`, `style.css`, `app.js`) at the repository root.
- Five tiles, two per row: Bitcoin in USD, Bitcoin in EUR, gold (EUR/oz), silver (EUR/oz),
  Vanguard FTSE All-World ETF (EUR). Each tile has a logo.
- A sticky segmented control with four buttons, "Aktuell", "7 T", "4 W", "YTD", that switches what all
  tiles show: the current price, or the percentage change over the selected period.
- Data from CoinGecko (Bitcoin, PAX Gold, Kinesis Silver) and onvista (ETF snapshot), fetched in the
  browser, refreshed every 5 minutes and when the tab becomes visible again.
- `netlify.toml` serving the repository root without a build.
- README with data sources, limitations, local run instructions and screenshots.

## Impact
- Affected specs: `market-dashboard` (new capability)
- Affected code: new files only — `index.html`, `style.css`, `app.js`, `netlify.toml`, `README.md`
