## ADDED Requirements

### Requirement: Asset tiles
The page SHALL show exactly eight tiles in this order, each with a logo, a name and a subtitle:

| # | Name | Subtitle | Logo | Currency |
|---|---|---|---|---|
| 1 | Bitcoin | in USD | orange circle, white ₿ | USD |
| 2 | Bitcoin | in EUR | orange circle, white ₿ | EUR |
| 3 | Gold | 1 Feinunze · EUR | gold circle with "Au" | EUR |
| 4 | Silber | 1 Feinunze · EUR | silver circle with "Ag" | EUR |
| 5 | All-World | Vanguard · EUR | globe icon, dark red circle | EUR |
| 6 | DAX | Index · Punkte | circle in black, red, gold bands | points |
| 7 | S&P 500 | Index · Punkte | dark blue circle with "500" | points |
| 8 | Euro Stoxx 50 | Index · Punkte | blue circle with a ring of 12 yellow dots | points |

Logos SHALL be inline SVG (no external image requests, no third-party trademark files).

#### Scenario: Page load
- **WHEN** the page is opened
- **THEN** eight tiles are shown immediately with logo, name, subtitle and a loading placeholder ("…")
- **AND** the placeholders are replaced once the data has loaded

### Requirement: View switcher
The page SHALL show a segmented control with four buttons labelled "Aktuell", "7 T", "4 W" and "YTD".
Exactly one is selected; "Aktuell" is selected on page load. Selecting a button SHALL re-render all
tiles for that view without fetching data again. Buttons SHALL use `role="tab"` with `aria-selected`.

#### Scenario: Current view
- **WHEN** "Aktuell" is selected
- **THEN** each tile shows the current price in its currency (de-DE, e.g. `67.134 €`, `75.388 $`,
  `46,01 €`; no decimals at or above 1000, two decimals below); index levels as plain numbers without
  a currency symbol (e.g. `25.980`)
- **AND** a small line "Stand <dd.mm.yy, hh:mm>" with the quote's timestamp

#### Scenario: Period view
- **WHEN** "7 T", "4 W" or "YTD" is selected
- **THEN** each tile shows the percentage change for that period with two decimals, a leading "+" for
  gains, green for gains, red for losses (e.g. `+12,49 %`, `-9,92 %`)
- **AND** a small line "seit 7 Tagen" / "seit 4 Wochen" / "seit Jahresbeginn", then " · " and the
  current price

#### Scenario: Value unavailable
- **WHEN** a period change cannot be computed (no reference price)
- **THEN** the tile shows "–" instead of a percentage

### Requirement: Performance calculation
For Bitcoin, gold and silver the page SHALL compute `(current / reference - 1) * 100`, where the
reference is the last daily history price at or before:
- 7 T: current timestamp minus 7 days
- 4 W: current timestamp minus 28 days
- YTD: 1 January 00:00 UTC of the current year (the previous year's closing price)

For the ETF and the indices the page SHALL use the precomputed percentages from the onvista snapshot.

#### Scenario: Year to date
- **WHEN** the current date is 2026-11-06 and the history contains a price for 2026-01-01T00:00Z
- **THEN** the YTD change is computed against that price

### Requirement: Data sources
The page SHALL load data in the browser, without a backend or API keys, from:
- Bitcoin USD: CoinGecko `coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily`
- Bitcoin EUR: CoinGecko `coins/bitcoin/market_chart?vs_currency=eur&days=365&interval=daily`
- Gold: CoinGecko `coins/pax-gold/market_chart?vs_currency=eur&days=365&interval=daily`
- Silver: CoinGecko `coins/kinesis-silver/market_chart?vs_currency=eur&days=365&interval=daily`
- ETF: onvista `funds/ISIN:IE00BK5BQT80/snapshot`
- DAX: onvista `indices/ISIN:DE0008469008/snapshot`
- S&P 500: onvista `indices/ISIN:US78378X1072/snapshot`
- EURO STOXX 50: onvista `indices/ISIN:EU0009658145/snapshot`

The page SHALL NOT call the onvista price-history endpoint.

#### Scenario: One source fails
- **WHEN** one request fails (network error or non-2xx status)
- **THEN** only that tile shows "Nicht verfügbar (<reason>)" in red
- **AND** all other tiles render normally

### Requirement: Refresh
The page SHALL reload all data every 5 minutes, and on `visibilitychange` to visible if the last load
is older than 5 minutes. The footer SHALL show "Zuletzt geladen: <dd.mm.yy, hh:mm>" after each load.

#### Scenario: Returning to the tab on a phone
- **WHEN** the user returns to the tab after 10 minutes in the background
- **THEN** the data is reloaded and the selected view is kept

### Requirement: Mobile-first layout
Two tiles per row at every width, content max width 640 px centered, view switcher sticky at the top
with touch targets at least 44 px high, safe-area insets respected, dark theme. Values SHALL NOT wrap
inside a tile.

#### Scenario: iPhone-sized viewport
- **WHEN** the page is shown at 390 × 844 px
- **THEN** tiles appear in a 2-column grid (four rows of two) without horizontal
  scrolling, and tile names and subtitles fit on one line each

### Requirement: Attribution
The footer SHALL link CoinGecko and onvista (ETF and indices), state that gold and silver are tracked via PAXG and KAG
(1 troy ounce each), and say "Keine Anlageberatung".

#### Scenario: Footer
- **WHEN** the page is loaded
- **THEN** the footer shows the data-source links and the disclaimer

### Requirement: Netlify deployment
The repository SHALL contain a `netlify.toml` that publishes the repository root with no build command.

#### Scenario: Deploy
- **WHEN** a commit is pushed to `main`
- **THEN** Netlify serves `index.html`, `style.css` and `app.js` from the repository root
