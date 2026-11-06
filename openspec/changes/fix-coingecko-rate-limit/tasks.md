## 1. Implementation
- [x] 1.1 `cachedJson(url)` with `localStorage` (try/catch around every access), 4-minute max age
- [x] 1.2 Use it for the CoinGecko `market_chart` requests
- [x] 1.3 Readable error for failed fetches in `getJson`

## 2. Verification
- [x] 2.1 First load: 4 CoinGecko requests; reload: 0 requests and identical values
- [x] 2.2 Cache older than 4 minutes: requests are sent again; blocked requests show the new message
- [x] 2.3 Bitcoin USD and EUR "Heute" agree again (no mixing of CoinGecko endpoints)
