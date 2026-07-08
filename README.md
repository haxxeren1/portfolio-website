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
  index.js               entry — Barba init, Webflow re-init hook, per-page setup
  modules/
    transitions.js       Cross Fade (all navigation) + Stacked Cards notes
    intro.js             one-time intro animation (sessionStorage gate)
    hovers.js            index-list hover previews          [Phase 5]
    webgl.js             WebGL hover on featured media      [Phase 5, lazy]
    player.js            Bunny HLS video player (HLS.js lazy from CDN)
    snake.js             404 snake game                     [Phase 5 vanilla port]
dist/main.js             built bundle — committed, served via jsDelivr
```

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
    var PROD = 'https://cdn.jsdelivr.net/gh/haxxeren1/portfolio-website@v2.0.0/dist/main.js';
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
| `data-intro="wrap\|name\|role\|shot"` | intro overlay elements (home) | intro.js |
| `data-hover` | index list rows | hovers.js |
| `data-webgl` | featured case media | webgl.js |
| `data-hls-src="<Bunny URL>"` | `<video>` elements (from CMS field) | player.js |
| `#root` | 404 snake mount | snake.js |

GSAP/Barba are bundled — do **not** also add them as separate scripts in Webflow.
