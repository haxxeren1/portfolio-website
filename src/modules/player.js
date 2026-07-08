// Bunny HLS video player (HLS.js loaded from CDN only when a player exists).
// Behaviour per spec: autoplay in view, muted by default with toggle, loop,
// no third-party branding. URL comes from the CMS "Bunny HLS URL" field via
// [data-hls-src] on a <video> element.
const HLS_CDN = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js'

let hlsPromise = null
function loadHls() {
  if (window.Hls) return Promise.resolve(window.Hls)
  hlsPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = HLS_CDN
    s.onload = () => resolve(window.Hls)
    s.onerror = reject
    document.head.appendChild(s)
  })
  return hlsPromise
}

export function initPlayers(container) {
  const videos = container.querySelectorAll('video[data-hls-src]')
  if (!videos.length) return

  videos.forEach(async (video) => {
    const src = video.dataset.hlsSrc
    video.muted = true
    video.loop = true
    video.playsInline = true

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src // Safari native HLS
    } else {
      const Hls = await loadHls()
      if (Hls?.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      }
    }

    new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => (e.isIntersecting ? video.play() : video.pause())),
      { threshold: 0.35 }
    ).observe(video)
  })
  // TODO Phase 5: styled mute-toggle control per design
}
