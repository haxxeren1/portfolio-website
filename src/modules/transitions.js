import { gsap } from 'gsap'

// Cross Fade — standard transition for all page-to-page navigation.
// Osmo reference: https://www.osmo.supply/resource/cross-fade-page-transition
// Swap this implementation for the Osmo Vault version when pasted in.
export const crossFade = {
  name: 'cross-fade',

  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    })
  },

  enter({ next }) {
    return gsap.from(next.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    })
  },
}

// Stacked Cards — used once, intro → homepage hand-off.
// Osmo reference: https://www.osmo.supply/resource/stacked-cards-page-transition
// Implemented inside intro.js timeline rather than as a Barba transition,
// since it plays before any navigation happens.
