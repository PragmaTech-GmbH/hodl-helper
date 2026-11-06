## MODIFIED Requirements

### Requirement: View switcher
The page SHALL show a segmented control with five buttons labelled "Heute", "T-1", "7 T", "4 W"
and "YTD". Exactly one is selected; "Heute" is selected on page load. Selecting a button
SHALL re-render all tiles for that view without fetching data again. Buttons SHALL use `role="tab"`
with `aria-selected`. All five labels SHALL fit on one line in one row down to a 320 px wide viewport.

#### Scenario: Period view
- **WHEN** a view is selected
- **THEN** each tile shows the percentage change for that period with two decimals, a leading "+" for
  gains, green for gains, red for losses (e.g. `+12,49 %`, `-9,92 %`)
- **AND** a small line "seit gestern" / "gestern" / "seit 7 Tagen" / "seit 4 Wochen" /
  "seit Jahresbeginn", then " · " and the current price in its currency (de-DE, e.g. `67.134 €`,
  `75.388 $`, `46,01 €`; no decimals at or above 1000, two decimals below; index levels as plain
  numbers without a currency symbol, e.g. `25.980`)

#### Scenario: Value unavailable
- **WHEN** a period change cannot be computed (no reference price)
- **THEN** the tile shows "–" instead of a percentage

### Requirement: Performance calculation
For Bitcoin, gold and silver the page SHALL compute `(value / reference - 1) * 100` from the daily
history (points at 00:00 UTC, the last point being the live price):
- Heute: live price against the price at 00:00 UTC of the current day (the previous day's close)
- T-1: price at 00:00 UTC of the current day against the price at 00:00 UTC of the previous day
- 7 T: live price against the last price at or before now minus 7 days
- 4 W: live price against the last price at or before now minus 28 days
- YTD: live price against the price at 1 January 00:00 UTC of the current year

For the ETF and the indices the page SHALL use the precomputed percentages from the onvista snapshot:
`quote.performancePct` (Heute), `cnPerformance.performanceRelD1` (T-1), `performanceRelW1` (7 T),
`performanceRelW4` (4 W) and `performanceRelCy` (YTD).

#### Scenario: Year to date
- **WHEN** the current date is 2026-11-06 and the history contains a price for 2026-01-01T00:00Z
- **THEN** the YTD change is computed against that price

#### Scenario: Today and yesterday
- **WHEN** the live Bitcoin price is taken at 2026-11-06T11:09Z and the history contains prices for
  2026-11-05T00:00Z and 2026-11-06T00:00Z
- **THEN** "Heute" compares the live price with the 2026-11-06T00:00Z price
- **AND** "T-1" compares the 2026-11-06T00:00Z price with the 2026-11-05T00:00Z price
