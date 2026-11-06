## MODIFIED Requirements

### Requirement: View switcher
The page SHALL show a segmented control with five buttons labelled "Aktuell", "Heute", "7 T", "4 W" and
"YTD". Exactly one is selected; "Aktuell" is selected on page load. Selecting a button SHALL re-render
all tiles for that view without fetching data again. Buttons SHALL use `role="tab"` with
`aria-selected`. All five buttons SHALL fit on one row down to a 320 px wide viewport.

#### Scenario: Current view
- **WHEN** "Aktuell" is selected
- **THEN** each tile shows the current price in its currency (de-DE, e.g. `67.134 €`, `75.388 $`,
  `46,01 €`; no decimals at or above 1000, two decimals below); index levels as plain numbers without
  a currency symbol (e.g. `25.980`)
- **AND** a small line "Stand <dd.mm.yy, hh:mm>" with the quote's timestamp

#### Scenario: Period view
- **WHEN** "Heute", "7 T", "4 W" or "YTD" is selected
- **THEN** each tile shows the percentage change for that period with two decimals, a leading "+" for
  gains, green for gains, red for losses (e.g. `+12,49 %`, `-9,92 %`)
- **AND** a small line "seit gestern" / "seit 7 Tagen" / "seit 4 Wochen" / "seit Jahresbeginn", then
  " · " and the current price

#### Scenario: Value unavailable
- **WHEN** a period change cannot be computed (no reference price)
- **THEN** the tile shows "–" instead of a percentage

### Requirement: Performance calculation
For Bitcoin, gold and silver the page SHALL compute `(current / reference - 1) * 100`, where the
reference is the last daily history price at or before:
- Heute: 00:00 UTC of the current day (the previous day's closing price)
- 7 T: current timestamp minus 7 days
- 4 W: current timestamp minus 28 days
- YTD: 1 January 00:00 UTC of the current year (the previous year's closing price)

For the ETF and the indices the page SHALL use the precomputed percentages from the onvista snapshot:
`quote.performancePct` (change against the previous close) for "Heute", and
`cnPerformance.performanceRelW1`, `performanceRelW4` and `performanceRelCy` for the other periods.

#### Scenario: Year to date
- **WHEN** the current date is 2026-11-06 and the history contains a price for 2026-01-01T00:00Z
- **THEN** the YTD change is computed against that price

#### Scenario: Since yesterday
- **WHEN** the live Bitcoin price is taken at 2026-11-06T11:09Z and the history contains a price for
  2026-11-06T00:00Z
- **THEN** the "Heute" change is computed against that 00:00 UTC price
