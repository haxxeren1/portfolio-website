// 404 snake game. v1 shipped a React implementation embedded on the 404 page
// (preserved at content/snake/ in the project folder). Phase 5 rewrites it in
// vanilla JS + GSAP here so the 404 stops loading React, restyled to v2 tokens.
// Mount point: #root inside the 404 Barba container.
export function initSnake(container) {
  const root = container.querySelector('#root')
  if (!root) return
  // TODO Phase 5: vanilla snake port (arrow keys, enter to start,
  // localStorage high score, wall teleport, speed-up every 3 points)
}
