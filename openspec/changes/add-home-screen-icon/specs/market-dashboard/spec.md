## ADDED Requirements

### Requirement: Home screen icon and favicon
The page SHALL declare a "Diamond Hands" icon (a light-blue diamond resting in two open palms, drawn
like the 🤲🏻 emoji with a light skin tone, on the dark page background):
- `apple-touch-icon.png`, 180 × 180 px, opaque (no transparency, since iOS fills transparent areas
  black and rounds the corners itself)
- `favicon.svg` for browsers with SVG favicon support, `favicon-32.png` as fallback

The home screen label SHALL be "HODL" (`apple-mobile-web-app-title`).

#### Scenario: Add to iPhone home screen
- **WHEN** the page is added to the home screen in Safari on an iPhone
- **THEN** the home screen shows the Diamond Hands icon labelled "HODL"

#### Scenario: Browser tab
- **WHEN** the page is open in a desktop or mobile browser tab
- **THEN** the tab shows the Diamond Hands favicon
