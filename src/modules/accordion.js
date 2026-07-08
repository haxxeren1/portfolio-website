// Work-page project accordion. Ported from the reference prototype
// (content/prototypes/work-index-accordion.html in the project folder).
// All motion lives in CSS keyed off .is-active (grid-rows 0fr→1fr collapse,
// peek↔description crossfade, staggered gallery rise) — this module only
// manages state, aria, and splitting the CMS plain-text tags into pills.
//
// Markup contract (Webflow classes):
//   [data-accordion]        accordion wrap (usually the CMS Collection List)
//   .accordion_row          one project (Collection Item)
//   .accordion_bar          clickable row header (button-like)
//   .accordion_toggle       the ( + ) / ( − ) marker
//   [data-tags]             element whose text is "Tag, Tag, Tag" from CMS
//   .accordion_tag          pill class applied to generated tag spans
export function initAccordion(container) {
  container.querySelectorAll('[data-accordion]').forEach((wrap) => {
    if (wrap.dataset.accordionInit) return
    wrap.dataset.accordionInit = 'true'

    // CMS binds tags as plain text ("Healthcare, Web") — split into pills
    wrap.querySelectorAll('[data-tags]').forEach((el) => {
      const raw = el.textContent.trim()
      if (!raw) return
      el.textContent = ''
      raw.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => {
        const pill = document.createElement('span')
        pill.className = 'accordion_tag'
        pill.textContent = t
        el.appendChild(pill)
      })
    })

    wrap.querySelectorAll('.accordion_bar').forEach((bar) => {
      bar.setAttribute('aria-expanded', 'false')
      bar.addEventListener('click', () => {
        const row = bar.closest('.accordion_row')
        if (!row) return
        const open = row.classList.toggle('is-active')
        bar.setAttribute('aria-expanded', open ? 'true' : 'false')
        const toggle = bar.querySelector('.accordion_toggle')
        if (toggle) toggle.textContent = open ? '( − )' : '( + )'
      })
    })
  })
}
