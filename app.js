'use strict';

const COINGECKO = 'https://api.coingecko.com/api/v3';
const ONVISTA = 'https://api.onvista.de/api/v1';
const DAY = 24 * 60 * 60 * 1000;
const REFRESH_MS = 5 * 60 * 1000;

const LOGOS = {
  btc: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#f7931a"/>
    <text x="16" y="22.5" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="system-ui, sans-serif">₿</text></svg>`,
  gold: `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="au" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f9e08b"/><stop offset="1" stop-color="#c9971c"/></linearGradient></defs>
    <circle cx="16" cy="16" r="16" fill="url(#au)"/>
    <text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#5c4208" font-family="system-ui, sans-serif">Au</text></svg>`,
  silver: `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f4f5f7"/><stop offset="1" stop-color="#9aa1ab"/></linearGradient></defs>
    <circle cx="16" cy="16" r="16" fill="url(#ag)"/>
    <text x="16" y="21" text-anchor="middle" font-size="13" font-weight="700" fill="#3d434b" font-family="system-ui, sans-serif">Ag</text></svg>`,
  world: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#96151d"/>
    <g fill="none" stroke="#fff" stroke-width="1.6"><circle cx="16" cy="16" r="9"/><ellipse cx="16" cy="16" rx="4" ry="9"/>
    <path d="M7 16h18M8.5 11.5h15M8.5 20.5h15"/></g></svg>`,
  dax: `<svg viewBox="0 0 32 32" aria-hidden="true"><clipPath id="de"><circle cx="16" cy="16" r="16"/></clipPath>
    <g clip-path="url(#de)"><path fill="#1a1a1a" d="M0 0h32v11H0z"/><path fill="#dd0000" d="M0 11h32v10H0z"/>
    <path fill="#ffce00" d="M0 21h32v11H0z"/></g></svg>`,
  spx: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#1f3c88"/>
    <text x="16" y="20.5" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="system-ui, sans-serif">500</text></svg>`,
  stoxx: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#003399"/>
    <g fill="#ffcc00">${Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return `<circle cx="${(16 + 9 * Math.sin(a)).toFixed(2)}" cy="${(16 - 9 * Math.cos(a)).toFixed(2)}" r="1.5"/>`;
    }).join('')}</g></svg>`,
};

const TILES = [
  { name: 'Bitcoin', unit: 'in USD', logo: LOGOS.btc, load: () => coinQuote('bitcoin', 'usd') },
  { name: 'Bitcoin', unit: 'in EUR', logo: LOGOS.btc, load: () => coinQuote('bitcoin', 'eur') },
  { name: 'Gold', unit: '1 Feinunze · EUR', logo: LOGOS.gold, load: () => coinQuote('pax-gold', 'eur') },
  { name: 'Silber', unit: '1 Feinunze · EUR', logo: LOGOS.silver, load: () => coinQuote('kinesis-silver', 'eur') },
  { name: 'All-World', unit: 'Vanguard · EUR', logo: LOGOS.world, load: () => onvistaQuote('funds', 'IE00BK5BQT80') },
  { name: 'DAX', unit: 'Index · Punkte', logo: LOGOS.dax, load: () => onvistaQuote('indices', 'DE0008469008') },
  { name: 'S&amp;P 500', unit: 'Index · Punkte', logo: LOGOS.spx, load: () => onvistaQuote('indices', 'US78378X1072') },
  { name: 'Euro Stoxx 50', unit: 'Index · Punkte', logo: LOGOS.stoxx, load: () => onvistaQuote('indices', 'EU0009658145') },
];

const VIEW_LABELS = { d1: 'gestern', w1: '7 Tagen', w4: '4 Wochen', ytd: 'Jahresbeginn' };

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Last price at or before the given timestamp; prices are [timestamp, price] sorted ascending.
function priceAt(prices, timestamp) {
  let found = null;
  for (const [t, p] of prices) {
    if (t > timestamp) break;
    found = p;
  }
  return found;
}

function change(current, past) {
  return past ? (current / past - 1) * 100 : null;
}

async function coinQuote(id, currency) {
  const { prices } = await getJson(
    `${COINGECKO}/coins/${id}/market_chart?vs_currency=${currency}&days=365&interval=daily`,
  );
  // Daily points sit at 00:00 UTC; the last point is the live price.
  const [updated, current] = prices.at(-1);
  const startOfYear = Date.UTC(new Date(updated).getUTCFullYear(), 0, 1);
  // Today's 00:00 UTC point is the previous day's close.
  const startOfDay = updated - (updated % DAY);
  return {
    currency: currency.toUpperCase(),
    current,
    updated,
    d1: change(current, priceAt(prices, startOfDay)),
    w1: change(current, priceAt(prices, updated - 7 * DAY)),
    w4: change(current, priceAt(prices, updated - 28 * DAY)),
    ytd: change(current, priceAt(prices, startOfYear)),
  };
}

// kind is the onvista instrument type ('funds', 'indices'); index levels are points, not a currency.
async function onvistaQuote(kind, isin) {
  const { quote, cnPerformance } = await getJson(`${ONVISTA}/${kind}/ISIN:${isin}/snapshot`);
  return {
    currency: kind === 'indices' ? null : quote.isoCurrency,
    current: quote.last,
    updated: Date.parse(quote.datetimeLast),
    d1: quote.performancePct, // change against the previous close (quote.previousLast)
    w1: cnPerformance.performanceRelW1,
    w4: cnPerformance.performanceRelW4,
    ytd: cnPerformance.performanceRelCy,
  };
}

function formatPrice(value, currency) {
  return new Intl.NumberFormat('de-DE', {
    ...(currency && { style: 'currency', currency }),
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatChange(value) {
  if (value == null) return '<div class="value">–</div>';
  const sign = value > 0 ? '+' : '';
  const css = value > 0 ? 'up' : value < 0 ? 'down' : '';
  const text = value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<div class="value ${css}">${sign}${text} %</div>`;
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' });
}

function renderBody(result, view) {
  if (!result) return '<div class="value loading">…</div>';
  if (result.error) return `<p class="error">Nicht verfügbar (${result.error.message})</p>`;
  const quote = result.quote;
  const price = formatPrice(quote.current, quote.currency);
  if (view === 'current') {
    return `<div class="value">${price}</div><div class="detail">Stand ${formatTime(quote.updated)}</div>`;
  }
  return `${formatChange(quote[view])}<div class="detail">seit ${VIEW_LABELS[view]} · ${price}</div>`;
}

const tileEls = TILES.map((tile) => {
  const el = document.createElement('section');
  el.className = 'tile';
  el.innerHTML = `
    <div class="tile-head">${tile.logo}
      <div><div class="tile-name">${tile.name}</div><div class="tile-unit">${tile.unit}</div></div>
    </div>
    <div class="tile-body"></div>`;
  document.getElementById('tiles').append(el);
  return el.querySelector('.tile-body');
});

const viewButtons = document.querySelectorAll('.views button');
const status = document.getElementById('status');
let view = 'current';
let results = [];
let lastLoad = 0;

function render() {
  tileEls.forEach((el, i) => { el.innerHTML = renderBody(results[i], view); });
  viewButtons.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === view)));
}

async function refresh() {
  lastLoad = Date.now();
  const settled = await Promise.allSettled(TILES.map((tile) => tile.load()));
  results = settled.map((s) => (s.status === 'fulfilled' ? { quote: s.value } : { error: s.reason }));
  status.textContent = `Zuletzt geladen: ${formatTime(Date.now())}`;
  render();
}

viewButtons.forEach((button) => button.addEventListener('click', () => {
  view = button.dataset.view;
  render();
}));

// Mobile browsers pause timers in background tabs, so reload stale data when the page comes back.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - lastLoad > REFRESH_MS) refresh();
});

render();
refresh();
setInterval(refresh, REFRESH_MS);
