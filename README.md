# damba.design — Portfolio Scripts (v2)

JavaScript powering [damba.design](https://damba.design) — all page transitions,
animations, and interactive components for the Webflow-hosted portfolio.

## Stack

- **Webflow** — design, CMS, hosting
- **Barba.js** — SPA-style page transitions, persistent navbar
- **GSAP** (+ ScrollTrigger) — all motion; Webflow IX2 is not used
- **Osmo Supply Vault** — prebuilt transition/hover recipes (pasted into `src/modules/`)
- **Vite** — dev server + bundling to a single `dist/main.js`
- **jsDelivr** — CDN delivery of `dist/main.js` into Webflow

## Structure

```
src/
  index.js               Osmo page-transition boilerplate (ES-module port):
                         Barba init + hooks, Lenis smooth scroll, CustomEase "osmo",
                         cross-fade transition, theme system, nav sync,
                         reduced-motion handling, function registry
  modules/
    intro.js             one-time intro animation (sessionStorage gate)
    hovers.js            index-list hover previews          [Phase 5]
    webgl.js             WebGL hover on featured media      [Phase 5, lazy]
    player.js            Bunny HLS video player (HLS.js lazy from CDN)
    snake.js             404 snake game                     [Phase 5 vanilla port]
dist/main.js             built bundle — committed, served via jsDelivr
```

New feature code goes in `src/modules/` and gets wired into the registry
functions in `index.js` (`initOnceFunctions` / `initBeforeEnterFunctions` /
`initAfterEnterFunctions`) using the `has('[data-…]')` helper.

## How to work on this repo

### 1. Local development

```bash
npm install       # once
npm run dev       # serves src/ at http://localhost:5173
```

In Webflow **Site settings → Custom code → Footer**, this loader picks
local vs CDN automatically:

```html
<script>
  (function () {
    var DEV = 'http://localhost:5173/src/index.js';
    var PROD = 'https://cdn.jsdelivr.net/gh/haxxeren1/portfolio-website@v2.1.0/dist/main.js';
    var s = document.createElement('script');
    if (localStorage.getItem('dev') === 'true') { s.type = 'module'; s.src = DEV; }
    else { s.src = PROD; s.defer = true; }
    document.head.appendChild(s);
  })();
</script>
```

Toggle dev mode in the browser console on the staging site:

```js
localStorage.setItem('dev', 'true')   // load from localhost (run `npm run dev` first)
localStorage.removeItem('dev')        // back to CDN
```

Edit files in `src/` — the staging site picks up changes on refresh.

### 2. Ship to production

```bash
npm run build                  # writes dist/main.js
git add -A && git commit -m "…"
git tag v2.0.1                 # bump the version
git push && git push --tags
```

Then update the `@v2.0.1` tag in the Webflow loader snippet and publish.

**Why tags, not `@main`:** jsDelivr caches `@main` for up to a week and needs
manual purging. A pinned tag is immutable — new tag, new URL, instant and
cache-proof.

> Previous README pointed at `gh/damba/portfolio-scripts` — wrong path, the
> repo is `gh/haxxeren1/portfolio-website`. That's why CDN loading never worked.

## Webflow markup contract

The JS finds its targets via attributes set in the Webflow Designer:

| Attribute | Where | Module |
|---|---|---|
| `data-barba="wrapper"` | page wrapper (navbar outside container = persistent) | index.js |
| `data-barba="container"` + `data-barba-namespace="home\|works\|case-study\|404"` | main content wrapper per page | index.js |
| `data-page-theme="light\|dark"` | on each barba container — drives body theme + nav/transition colors | index.js |
| `data-theme-nav` | navbar (gets `light`/`dark` set per page theme) | index.js |
| `data-theme-transition` | transition overlay element | index.js |
| `data-barba-update` | nav links — `aria-current`/class synced from incoming page | index.js |
| `data-intro="wrap\|name\|role\|shot"` | intro overlay elements (home) | intro.js |
| `data-hover` | index list rows | hovers.js |
| `data-webgl` | featured case media | webgl.js |
| `data-hls-src="<Bunny URL>"` | `<video>` elements (from CMS field) | player.js |
| `#root` | 404 snake mount | snake.js |

GSAP, Barba, and Lenis are bundled — do **not** also add them as separate
scripts in Webflow.

## Working in Antigravity

The repo lives at `Desktop/webflow portfolio/portfolio-website`. To author
from Antigravity:

1. Install Antigravity and sign into GitHub inside it (one-time OAuth)
2. **File → Open Folder** → select `portfolio-website` (or clone
   `https://github.com/haxxeren1/portfolio-website` fresh)
3. In its terminal: `npm install` once, then `npm run dev` while designing —
   with the staging site in dev mode (see loader snippet above), edits in
   `src/` show up on refresh
4. Ship from Antigravity's source-control panel: commit → push, then in the
   terminal `git tag v2.x.y && git push --tags`
5. Bump the `@v2.x.y` tag in the Webflow loader snippet and publish

Same rules as anywhere else: feature code in `src/modules/`, wire it into the
registry in `index.js`, never commit without running `npm run build` so
`dist/main.js` matches `src/`.
