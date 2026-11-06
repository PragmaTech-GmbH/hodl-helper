## 1. Implementation
- [x] 1.1 `index.html`: "Heute" button (`data-view="d1"`) between "Aktuell" and "7 T"
- [x] 1.2 `style.css`: segmented control with five columns
- [x] 1.3 `app.js`: `d1` in the normalized quote (CoinGecko: since 00:00 UTC today; onvista:
      `quote.performancePct`), detail label "seit gestern"
- [x] 1.4 README: describe the new view

## 2. Verification
- [x] 2.1 All five views at iPhone size (Playwright `devices['iPhone 13']`); still 8 requests per load
- [x] 2.2 Buttons fit on one row at 360 px and 320 px
- [x] 2.3 Spot-check: Bitcoin EUR "Heute" matches live price / today's 00:00 UTC price; ETF matches
      `last / previousLast`
