import { gsap } from 'gsap'

const INTRO_KEY = 'introPlayed'

// One-time intro (home page only):
//   1. "Damba Radnaev" appears
//   2. "Designer" appears below
//   3. Three featured-project shots reveal sequentially
//   4. Stacked Cards hand-off into the homepage
//      (https://www.osmo.supply/resource/stacked-cards-page-transition)
//
// Expected markup (built in Webflow, hidden until this runs):
//   [data-intro="wrap"]  — full-screen overlay
//   [data-intro="name"], [data-intro="role"], [data-intro="shot"] ×3
//
// Homepage interaction stays blocked (overlay on top) until the timeline ends.
export function initIntro(container) {
  const wrap = document.querySelector('[data-intro="wrap"]')
  if (!wrap) return

  if (sessionStorage.getItem(INTRO_KEY)) {
    wrap.remove()
    return
  }

  const tl = gsap.timeline({
    onComplete() {
      sessionStorage.setItem(INTRO_KEY, '1')
      wrap.remove()
    },
  })

  tl.from('[data-intro="name"]', { yPercent: 110, duration: 0.8, ease: 'power3.out' })
    .from('[data-intro="role"]', { yPercent: 110, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('[data-intro="shot"]', { autoAlpha: 0, stagger: 0.35, duration: 0.5 })
    // TODO Phase 5: replace this fade with the Osmo Stacked Cards hand-off
    .to(wrap, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.4')
}
