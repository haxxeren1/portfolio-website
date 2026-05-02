# damba.design — Portfolio Scripts

JavaScript powering [damba.design](https://damba.design) — a Webflow portfolio for product & UX design work.

## Stack

- **Webflow** — design, CMS, and hosting
- **Barba.js** — client-side page routing and transition management
- **GSAP** — animation engine
- **Osmo Supply** — prebuilt Barba + GSAP transition recipes
- **Antigravity** — browser-based JS dev environment

## Pages

| Page | Barba Namespace |
|---|---|
| Home | `home` |
| Works index | `works` |
| Case study (CMS) | `case-study` |
| Editorial case studies | `editorial` |

## Features

- Fade in/out page transitions via Barba.js
- Persistent navigation across all page transitions
- Light / dark mode
- Webflow IX2 re-initialization after every page swap
- Scroll reset on navigation

## Structure

```
main.js
  ├── Barba init
  ├── Transition definitions (fade in/out)
  ├── Per-namespace view logic
  ├── Webflow re-init hook (IX2, forms)
  └── Light/dark mode logic
```

## Development

JS is authored in [Antigravity](https://antigravity.dev) and versioned here for production delivery via jsDelivr.

**CDN URL**
```
https://cdn.jsdelivr.net/gh/damba/portfolio-scripts@main/main.js
```

**To update**
1. Edit in Antigravity
2. Copy final JS into `main.js`
3. Commit and push to `main`
4. Purge jsDelivr cache if needed:
   `https://purge.jsdelivr.net/gh/damba/portfolio-scripts@main/main.js`
