import barba from '@barba/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { crossFade } from './modules/transitions.js'
import { initIntro } from './modules/intro.js'
import { initHovers } from './modules/hovers.js'
import { initWebgl } from './modules/webgl.js'
import { initPlayers } from './modules/player.js'
import { initSnake } from './modules/snake.js'

gsap.registerPlugin(ScrollTrigger)

// Re-init Webflow-managed behaviour (forms, embeds) after each Barba swap.
// IX2 is intentionally NOT re-initialised — all motion lives in this repo (GSAP).
function reinitWebflow() {
  if (!window.Webflow) return
  window.Webflow.destroy()
  window.Webflow.ready()
}

// Per-page setup shared by first load and every Barba enter
function initPage(container) {
  initHovers(container)
  initWebgl(container)
  initPlayers(container)
}

barba.init({
  // Navbar lives outside data-barba="container" → persistent by structure
  transitions: [crossFade],
  views: [
    {
      namespace: 'home',
      beforeEnter({ next }) {
        initIntro(next.container)
      },
    },
    {
      namespace: '404',
      beforeEnter({ next }) {
        initSnake(next.container)
      },
    },
    // 'works' (index) and 'case-study' get dedicated logic in Phase 5
  ],
})

barba.hooks.enter(() => {
  window.scrollTo(0, 0)
})

barba.hooks.afterEnter(({ next }) => {
  reinitWebflow()
  ScrollTrigger.killAll()
  initPage(next.container)
  ScrollTrigger.refresh()
})

// First (hard) load — Barba doesn't fire afterEnter for it
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('[data-barba="container"]')
  if (!container) return
  const ns = container.dataset.barbaNamespace
  if (ns === 'home') initIntro(container)
  if (ns === '404') initSnake(container)
  initPage(container)
})
