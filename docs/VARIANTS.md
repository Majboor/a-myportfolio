# Landing A/B Variants

The hero/landing section ships in two interchangeable layouts so the headline,
structure and call-to-action can be A/B-tested without a rebuild.

## How to switch

| Method | Result |
| --- | --- |
| Visit `/` | Variant **A** (default) |
| Visit `/?variant=b` | Variant **B** |
| Click the **Layout A / B** pill in the hero | Switches live and updates the URL |

The choice is persisted to `localStorage` and reflected on `<html data-variant>`,
so a reload (or a plain `?variant=b` share link) keeps the selected layout.

## The two variants

**Variant A — narrative hero** (original)
- Headline: *"I build fast, polished web products — from 3D storefronts to AI apps."*
- Single-column, left-aligned copy with a 4-up stat strip.
- Primary CTA: **See my work** → `#work`; secondary: **GitHub**.

**Variant B — "terminal" split hero**
- Headline: *"Ship the thing. I turn rough ideas into products people can open."*
- Two-column: punchy copy + a monospace terminal card listing shipped projects
  and the stack (stats collapse to an inline row).
- Primary CTA: **Start a project** → `#contact`; secondary: **Browse the work**.
- Stacks to a single column below 820px (terminal card moves above the copy).

Both variants respect `prefers-reduced-motion` (the terminal cursor stops
blinking) and the existing light/dark theme via shared CSS custom properties.

## Implementation

- `src/useVariant.js` — reads `?variant=`, syncs URL / `localStorage` / `data-variant`.
- `src/Hero.jsx` — `<Hero>` picks `HeroA` or `HeroB`; both share the icon set
  passed from `App.jsx`, and the A/B toggle pill is rendered in both.
- `src/hero-b.css` — additive styles for variant B and the toggle (no overrides
  of existing shared selectors, to keep the diff isolated).
- `src/App.jsx` — swaps the inline hero for `<Hero>` and wires `useVariant()`.
