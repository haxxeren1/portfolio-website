// Optional WebGL hover distortion on featured-case media.
// Loaded lazily at runtime so the main bundle stays small, and skipped
// entirely for touch devices and reduced-motion users (plain image fallback).
export function initWebgl(container) {
  const media = container.querySelectorAll('[data-webgl]')
  if (!media.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(hover: none)').matches) return
  // TODO Phase 5: dynamic-import the Osmo WebGL hover component here
  // e.g. const { mount } = await import('https://cdn.jsdelivr.net/npm/ogl@1/+esm')
}
