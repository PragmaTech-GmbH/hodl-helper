# Change: Add home screen icon and favicon

## Why
When the page is added to the iPhone home screen ("Zum Home-Bildschirm"), iOS shows a screenshot of the
page instead of an icon, because the page declares none. Browser tabs show no favicon either.

## What Changes
- Add a "Diamond Hands" icon (a diamond held by two hands, from the HODL/Bitcoin meme): `favicon.svg`
  as the source, rendered to `apple-touch-icon.png` (180 × 180) and `favicon-32.png` (32 × 32).
- Link the icons in `index.html` and set the home screen label with `apple-mobile-web-app-title`.

## Impact
- Affected specs: `market-dashboard`
- Affected code: `index.html`; new files `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`
