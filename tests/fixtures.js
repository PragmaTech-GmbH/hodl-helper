// Stubbed CoinGecko and onvista responses. The browser clock is pinned to NOW, so the expected
// percentages in the specs follow directly from the prices below.

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-11-06T12:00:00Z');

// Bitcoin in EUR; the other CoinGecko assets are scaled copies, so they show the same percentages.
const BTC_EUR_CLOSES = {
  '2026-01-01': 50000, // YTD reference
  '2026-10-09': 60000, // 4 W reference (NOW - 28 days)
  '2026-10-30': 64000, // 7 T reference (NOW - 7 days)
  '2026-11-05': 70000, // close before yesterday's close (T-1 reference)
  '2026-11-06': 66000, // yesterday's close (Heute reference)
};
const BTC_EUR_LIVE = 67320;
const BTC_EUR_FILL = 55000;

const SCALE = {
  'bitcoin:eur': 1,
  'bitcoin:usd': 1.12,
  'pax-gold:eur': 0.054,
  'kinesis-silver:eur': 0.0007,
};

// market_chart shape: daily points at 00:00 UTC for the last 365 days, then the live price.
function marketChart(scale) {
  const today = NOW - (NOW % DAY);
  const prices = [];
  for (let t = today - 365 * DAY; t <= today; t += DAY) {
    const date = new Date(t).toISOString().slice(0, 10);
    prices.push([t, (BTC_EUR_CLOSES[date] ?? BTC_EUR_FILL) * scale]);
  }
  prices.push([NOW, BTC_EUR_LIVE * scale]);
  return { prices };
}

function snapshot({ last, currency, today, yesterday, w1, w4, ytd }) {
  return {
    quote: { last, isoCurrency: currency, datetimeLast: '2026-11-06T11:55:00.000+00:00', performancePct: today },
    cnPerformance: {
      performanceRelD1: yesterday,
      performanceRelW1: w1,
      performanceRelW4: w4,
      performanceRelCy: ytd,
    },
  };
}

const ONVISTA = {
  'funds/ISIN:IE00BK5BQT80': snapshot({
    last: 164.5, currency: 'EUR', today: 0.62, yesterday: -3.86, w1: -4.06, w4: -5.61, ytd: 12.49,
  }),
  'indices/ISIN:DE0008469008': snapshot({
    last: 25980.54, currency: 'EUR', today: -1.22, yesterday: -1.67, w1: 0.42, w4: 3.46, ytd: 6.74,
  }),
  'indices/ISIN:US78378X1072': snapshot({
    last: 7354.98, currency: 'USD', today: 0.21, yesterday: -4.3, w1: -4.69, w4: -5.34, ytd: 7.49,
  }),
  'indices/ISIN:EU0009658145': snapshot({
    last: 6154.32, currency: 'EUR', today: -0.35, yesterday: -1.99, w1: -0.28, w4: -1.26, ytd: 6.51,
  }),
};

const CORS = { 'access-control-allow-origin': '*' };

// Routes every request that leaves localhost: CoinGecko and onvista get fixtures (or the given
// status), anything else is aborted so no test touches the real network.
// Returns the list of CoinGecko and onvista URLs the page requested.
async function stubApis(page, { coingeckoStatus = 200, onvistaStatus = 200 } = {}) {
  const requests = [];
  await page.route((url) => url.hostname !== 'localhost', (route) => route.abort());

  await page.route('https://api.coingecko.com/**', (route) => {
    const url = new URL(route.request().url());
    requests.push(url.href);
    if (coingeckoStatus === 429) {
      // The real 429 has no CORS header, so the browser reports a network error. Fulfilled responses
      // skip the CORS check, so the network error is emulated directly.
      return route.abort('failed');
    }
    const id = url.pathname.split('/')[4];
    const scale = SCALE[`${id}:${url.searchParams.get('vs_currency')}`];
    if (coingeckoStatus !== 200 || !scale) return route.fulfill({ status: coingeckoStatus === 200 ? 404 : coingeckoStatus, headers: CORS });
    return route.fulfill({ json: marketChart(scale), headers: CORS });
  });

  await page.route('https://api.onvista.de/**', (route) => {
    const url = new URL(route.request().url());
    requests.push(url.href);
    const body = ONVISTA[url.pathname.replace('/api/v1/', '').replace('/snapshot', '')];
    if (onvistaStatus !== 200 || !body) return route.fulfill({ status: onvistaStatus === 200 ? 404 : onvistaStatus, headers: CORS });
    return route.fulfill({ json: body, headers: CORS });
  });

  return requests;
}

// Opens the dashboard with the clock pinned to NOW and waits until all tiles have loaded.
async function openDashboard(page, options) {
  const requests = await stubApis(page, options);
  await page.clock.install({ time: NOW });
  await page.goto('/');
  await page.getByText(/Zuletzt geladen/).waitFor();
  return requests;
}

module.exports = { NOW, openDashboard, stubApis };
