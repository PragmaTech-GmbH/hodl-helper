// Unit tests for the pure helpers in app.js. app.js is a classic script, so its function
// declarations are globals in the page and are called through page.evaluate.
const { test, expect } = require('@playwright/test');
const { openDashboard } = require('./fixtures');

test.beforeEach(async ({ page }) => {
  await openDashboard(page);
});

test('priceAt returns the last price at or before the timestamp', async ({ page }) => {
  const results = await page.evaluate(() => {
    const prices = [[100, 1], [200, 2], [300, 3]];
    return [priceAt(prices, 50), priceAt(prices, 100), priceAt(prices, 250), priceAt(prices, 999)];
  });
  expect(results).toEqual([null, 1, 2, 3]);
});

test('change is a percentage and null without a reference', async ({ page }) => {
  const results = await page.evaluate(() => [change(110, 100), change(90, 100), change(100, null), change(100, 0)]);
  expect(results[0]).toBeCloseTo(10);
  expect(results[1]).toBeCloseTo(-10);
  expect(results.slice(2)).toEqual([null, null]);
});

test('formatPrice uses de-DE, no decimals from 1000 and no symbol for index points', async ({ page }) => {
  const results = await page.evaluate(() =>
    [formatPrice(67320.4, 'EUR'), formatPrice(75398.4, 'USD'), formatPrice(46.01, 'EUR'), formatPrice(25980.54, null)]
      .map((text) => text.replace(/ /g, ' ')));
  expect(results).toEqual(['67.320 €', '75.398 $', '46,01 €', '25.981']);
});

test('formatChange signs and colors the value, or shows a dash', async ({ page }) => {
  const results = await page.evaluate(() => [formatChange(1.5), formatChange(-9.921), formatChange(0), formatChange(null)]);
  expect(results).toEqual([
    '<div class="value up">+1,50 %</div>',
    '<div class="value down">-9,92 %</div>',
    '<div class="value ">0,00 %</div>',
    '<div class="value">–</div>',
  ]);
});
