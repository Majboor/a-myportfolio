# Waleed Ajmal — Portfolio

Personal developer portfolio for **Waleed Ajmal**, a full-stack & AI developer.
Live at [waleeds.world](https://waleeds.world).

Original, hand-built single-page site — no templates, no third-party themes.

## Stack

- **React 18** + **Vite** (static SPA)
- Plain CSS with light/dark theming (CSS custom properties)
- Deployed on **Cloudflare Pages** (`npm run build` → `dist/`)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Structure

- `src/App.jsx` — page layout and sections
- `src/data.js` — curated project + skills data (links to real public repos)
- `src/styles.css` — theme + component styles
- `docs/media/` — rendered preview screenshots

## Preview

![Home — dark](docs/media/home-dark.png)
![Home — light](docs/media/home-light.png)
