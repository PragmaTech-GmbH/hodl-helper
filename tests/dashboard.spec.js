// End-to-end tests against the real page with stubbed CoinGecko and onvista responses
// (see fixtures.js for the prices behind the expected numbers).
const { test, expect } = require('@playwright/test');
const { openDashboard } = require('./fixtures');

const tile = (page, text) => page.locator('.tile', { hasText: text });

test('opens in "Heute" with eight tiles in two columns', async ({ page }) => {
  await openDashboard(page);

  await expect(page.getByRole('tab')).toHaveText(['Heute', 'T-1', '7 T', '4 W', 'YTD']);
  await expect(page.getByRole('tab', { name: 'Heute' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.tile .tile-name')).toHaveText([
    'Bitcoin', 'Bitcoin', 'Gold', 'Silber', 'All-World', 'DAX', 'S&P 500', 'Euro Stoxx 50',
  ]);

  await expect(tile(page, 'in EUR').locator('.value')).toHaveText('+2,00 %');
  await expect(tile(page, 'in EUR').locator('.detail')).toHaveText('seit gestern · 67.320 €');
  await expect(tile(page, 'in USD').locator('.detail')).toHaveText('seit gestern · 75.398 $');
  await expect(tile(page, 'Silber').locator('.detail')).toHaveText('seit gestern · 47,12 €');
  await expect(tile(page, 'DAX').locator('.detail')).toHaveText('seit gestern · 25.981');

  const layout = await page.evaluate(() => ({
    columns: getComputedStyle(document.getElementById('tiles')).gridTemplateColumns.split(' ').length,
    horizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
  }));
  expect(layout).toEqual({ columns: 2, horizontalScroll: false });
});

test('switches views without fetching again', async ({ page }) => {
  const requests = await openDashboard(page);
  expect(requests).toHaveLength(8);

  const views = [
    // tab, Bitcoin EUR (computed from the history), ETF (from onvista), detail prefix
    ['T-1', '-5,71 %', '-3,86 %', 'gestern'],
    ['7 T', '+5,19 %', '-4,06 %', 'seit 7 Tagen'],
    ['4 W', '+12,20 %', '-5,61 %', 'seit 4 Wochen'],
    ['YTD', '+34,64 %', '+12,49 %', 'seit Jahresbeginn'],
    ['Heute', '+2,00 %', '+0,62 %', 'seit gestern'],
  ];
  for (const [tab, bitcoin, etf, detail] of views) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[aria-selected="true"]')).toHaveCount(1);
    await expect(tile(page, 'in EUR').locator('.value')).toHaveText(bitcoin);
    await expect(tile(page, 'All-World').locator('.value')).toHaveText(etf);
    await expect(tile(page, 'All-World').locator('.detail')).toHaveText(`${detail} · 164,50 €`);
  }
  expect(requests).toHaveLength(8);
});

test('colors gains green and losses red', async ({ page }) => {
  await openDashboard(page);
  await expect(tile(page, 'in EUR').locator('.value')).toHaveClass(/\bup\b/);
  await expect(tile(page, 'DAX').locator('.value')).toHaveClass(/\bdown\b/);
});

test('a failing onvista only breaks the ETF and index tiles', async ({ page }) => {
  await openDashboard(page, { onvistaStatus: 500 });

  for (const name of ['All-World', 'DAX', 'S&P 500', 'Euro Stoxx 50']) {
    await expect(tile(page, name).locator('.error')).toHaveText('Nicht verfügbar (HTTP 500)');
  }
  for (const name of ['in USD', 'in EUR', 'Gold', 'Silber']) {
    await expect(tile(page, name).locator('.value')).toHaveText('+2,00 %');
  }
});

test('a rate-limited CoinGecko shows a readable error', async ({ page }) => {
  await openDashboard(page, { coingeckoStatus: 429 });

  for (const name of ['in USD', 'in EUR', 'Gold', 'Silber']) {
    await expect(tile(page, name).locator('.error')).toHaveText('Nicht verfügbar (nicht erreichbar oder Limit erreicht)');
  }
  await expect(tile(page, 'DAX').locator('.value')).toHaveText('-1,22 %');
});

test('reuses cached CoinGecko data on reload and refetches on the 5-minute refresh', async ({ page }) => {
  const requests = await openDashboard(page);
  const coingecko = () => requests.filter((url) => url.includes('coingecko')).length;
  expect(coingecko()).toBe(4);

  await page.reload();
  await page.getByText(/Zuletzt geladen/).waitFor();
  await expect(tile(page, 'in EUR').locator('.value')).toHaveText('+2,00 %');
  expect(coingecko()).toBe(4);

  await page.clock.fastForward('05:00');
  await expect.poll(coingecko).toBe(8);
});
