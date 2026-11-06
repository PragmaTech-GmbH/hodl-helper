## ADDED Requirements

### Requirement: CoinGecko request caching
The page SHALL cache each CoinGecko response in `localStorage` together with its fetch time and reuse it
for 4 minutes instead of requesting it again. When `localStorage` is unavailable the page SHALL work
without the cache.

#### Scenario: Reload within 4 minutes
- **WHEN** the page is reloaded 1 minute after the previous load
- **THEN** no CoinGecko request is sent and the CoinGecko tiles show the cached values

#### Scenario: Automatic refresh
- **WHEN** the 5-minute refresh runs
- **THEN** the cached responses are older than 4 minutes and are fetched again

#### Scenario: Request blocked or rate-limited
- **WHEN** a request fails before a response can be read (network error, or HTTP 429 without CORS header)
- **THEN** the tile shows "Nicht verfügbar (nicht erreichbar oder Limit erreicht)"
