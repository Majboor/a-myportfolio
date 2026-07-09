# Tests

Automated test suite for the portfolio.

## Layout

- `tests/unit/` — Vitest + React Testing Library. Cover the content data
  (`data.js`) and the `App` component (structure, project/skill/stat rendering,
  safe external links, and the theme toggle).
- `tests/e2e/` — Playwright smoke tests against the real production build
  (`vite preview`): page load, work grid, in-page navigation, theme persistence,
  external-link safety, and a console-error check.
- `tests/setup.js` — jsdom globals (`matchMedia`, `localStorage` reset) for unit tests.

## Running

```bash
npm run test          # unit tests (headless, jsdom)
npm run test:watch    # unit tests in watch mode
npm run test:coverage # unit tests with v8 coverage
npm run test:e2e      # Playwright e2e (auto-builds + serves on :8725)
```

The e2e config starts its own server, so no manual `npm run preview` is needed.
CI runs both suites via `.github/workflows/ci.yml`.
