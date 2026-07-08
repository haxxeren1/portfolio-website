// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// (adapted to ES modules — libs bundled via npm instead of CDN globals)
// -----------------------------------------

import barba from '@barba/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

import { initIntro } from './modules/intro.js'
import { initAccordion } from './modules/accordion.js'
import { initHovers } from './modules/hovers.js'
import { initWebgl } from './modules/webgl.js'
import { initPlayers } from './modules/player.js'
import { initSnake } from './modules/snake.js'

gsap.registerPlugin(ScrollTrigger, CustomEase)

history.scrollRestoration = 'manual'

let lenis = null
let nextPage = document
let onceFunctionsInitialized = false

// Bundled via npm, so both are always present — kept as flags to preserve
// the boilerplate's structure (and allow opting a lib out later)
const hasLenis = true
const hasScrollTrigger = true

const rmMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
let reducedMotion = rmMQ.matches
rmMQ.addEventListener?.('change', (e) => (reducedMotion = e.matches))
rmMQ.addListener?.((e) => (reducedMotion = e.matches))

const has = (s) => !!nextPage.querySelector(s)

let staggerDefault = 0.05
let durationDefault = 0.6

CustomEase.create('osmo', '0.625, 0.05, 0, 1')
gsap.defaults({ ease: 'osmo', duration: durationDefault })

// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis()
  if (onceFunctionsInitialized) return
  onceFunctionsInitialized = true

  // Runs once on first load
  if (has('[data-intro="wrap"]')) initIntro(nextPage)
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document

  // Runs before the enter animation
}

function initAfterEnterFunctions(next) {
  nextPage = next || document

  // Runs after enter animation completes
  if (has('[data-accordion]')) initAccordion(nextPage)
  if (has('[data-hover]')) initHovers(nextPage)
  if (has('[data-webgl]')) initWebgl(nextPage)
  if (has('video[data-hls-src]')) initPlayers(nextPage)
  if (has('#root')) initSnake(nextPage)

  reinitWebflow()

  if (hasLenis) {
    lenis.resize()
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh()
  }
}

// Re-init Webflow-managed behaviour (forms, embeds) after each swap.
// IX2 is intentionally NOT re-initialised — all motion lives in this bundle.
// Skipped on first load: Webflow booted the page itself there.
let firstLoad = true
function reinitWebflow() {
  if (firstLoad) {
    firstLoad = false
    return
  }
  if (!window.Webflow) return
  window.Webflow.destroy()
  window.Webflow.ready()
}

// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline()

  tl.call(() => {
    resetPage(next)
  }, null, 0)

  return tl
}

function runPageLeaveAnimation(current, next) {
  const tl = gsap.timeline({
    onComplete: () => { current.remove() },
  })

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    return tl.set(current, { autoAlpha: 0 })
  }

  tl.to(current, { autoAlpha: 0, duration: 0.4 })

  return tl
}

function runPageEnterAnimation(next) {
  const tl = gsap.timeline()

  if (reducedMotion) {
    // Immediate swap behavior if user prefers reduced motion
    tl.set(next, { autoAlpha: 1 })
    tl.add('pageReady')
    tl.call(resetPage, [next], 'pageReady')
    return new Promise((resolve) => tl.call(resolve, null, 'pageReady'))
  }

  tl.add('startEnter', 0.6)

  tl.fromTo(next, {
    autoAlpha: 0,
  }, {
    autoAlpha: 1,
  }, 'startEnter')

  tl.add('pageReady')
  tl.call(resetPage, [next], 'pageReady')

  return new Promise((resolve) => {
    tl.call(resolve, null, 'pageReady')
  })
}

// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.beforeEnter((data) => {
  // Position new container on top
  gsap.set(data.next.container, {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
  })

  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop()
  }

  initBeforeEnterFunctions(data.next.container)
  applyThemeFrom(data.next.container)
})

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
})

barba.hooks.enter((data) => {
  initBarbaNavUpdate(data)
})

barba.hooks.afterEnter((data) => {
  // Run page functions
  initAfterEnterFunctions(data.next.container)

  // Settle
  if (hasLenis) {
    lenis.resize()
    lenis.start()
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh()
  }
})

barba.init({
  debug: import.meta.env.DEV,
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: 'default',
      sync: true,

      // First load
      async once(data) {
        nextPage = data.next.container
        applyThemeFrom(data.next.container)
        initOnceFunctions()
        initAfterEnterFunctions(data.next.container)

        return runPageOnceAnimation(data.next.container)
      },

      // Current page leaves
      async leave(data) {
        return runPageLeaveAnimation(data.current.container, data.next.container)
      },

      // New page enters
      async enter(data) {
        return runPageEnterAnimation(data.next.container)
      },
    },
  ],
})

// -----------------------------------------
// GENERIC + HELPERS
// -----------------------------------------

const themeConfig = {
  light: {
    nav: 'dark',
    transition: 'light',
  },
  dark: {
    nav: 'light',
    transition: 'dark',
  },
}

function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || 'light'
  const config = themeConfig[pageTheme] || themeConfig.light

  document.body.dataset.pageTheme = pageTheme
  const transitionEl = document.querySelector('[data-theme-transition]')
  if (transitionEl) {
    transitionEl.dataset.themeTransition = config.transition
  }

  const nav = document.querySelector('[data-theme-nav]')
  if (nav) {
    nav.dataset.themeNav = config.nav
  }
}

function initLenis() {
  if (lenis) return // already created
  if (!hasLenis) return

  lenis = new Lenis({
    lerp: 0.165,
    wheelMultiplier: 1.25,
  })

  if (hasScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update)
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
}

function resetPage(container) {
  window.scrollTo(0, 0)
  gsap.set(container, { clearProps: 'position,top,left,right' })

  if (hasLenis) {
    lenis.resize()
    lenis.start()
  }
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth
        fn.apply(this, args)
      }
    }, ms)
  }
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement('template')
  tpl.innerHTML = data.next.html.trim()
  var nextNodes = tpl.content.querySelectorAll('[data-barba-update]')
  var currentNodes = document.querySelectorAll('nav [data-barba-update]')

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index]
    if (!next) return

    // Aria-current sync
    var newStatus = next.getAttribute('aria-current')
    if (newStatus !== null) {
      curr.setAttribute('aria-current', newStatus)
    } else {
      curr.removeAttribute('aria-current')
    }

    // Class list sync
    var newClassList = next.getAttribute('class') || ''
    curr.setAttribute('class', newClassList)
  })
}

// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// (page/feature modules live in src/modules/ and are wired
//  into the registry functions above)
// -----------------------------------------

export { gsap, ScrollTrigger, lenis, debounceOnWidthChange, staggerDefault, durationDefault }
