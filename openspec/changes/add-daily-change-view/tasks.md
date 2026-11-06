## 1. Implementation
- [x] 1.1 `index.html`: buttons "Heute" (`data-view="today"`, selected), "T-1"
      (`data-view="yesterday"`), "7 T", "4 W", "YTD"; remove "Aktuell"
- [x] 1.2 `style.css`: five columns; labels `nowrap`
- [x] 1.3 `app.js`: `today` and `yesterday` in the normalized quote (CoinGecko from the 00:00 UTC
      points; onvista `quote.performancePct` and `cnPerformance.performanceRelD1`); drop the price-only
      view and `updated`; start in "Heute"
- [x] 1.4 README: describe the views, new screenshots

## 2. Verification
- [x] 2.1 All five views at iPhone size (Playwright `devices['iPhone 13']`); still 8 requests per load
- [x] 2.2 Buttons fit on one line in one row at 390, 360 and 320 px
- [x] 2.3 Spot-check: Bitcoin EUR "T-1" equals today's 00:00 UTC price / yesterday's 00:00 UTC
      price; ETF "7 T" from onvista equals `previousLast / lastPriceW1`, which shows that onvista's
      period values (including D1) are based on the previous close
