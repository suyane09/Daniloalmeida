import { useEffect } from 'react'

const REVEAL = [
  '.problem .h2, .problem__sub', '.rows .row', '.method__head > *', '.steps > *', '.method__cta',
  '.training-areas__head > *', '.training-areas__list > *',
  '.about__copy > *', '.creds li', '.company',
  '.gallery-sec .h2', '.moments__cta',
  '.faq-sec__head > *', '.faq__panel', '.final__copy > *', ]
const WIPE = ['.about__photo .clip', '.moments__item', '.final__photo']
const SPOT = '.services__card, .modal__card, .company, .moments__cta, .row'

const fmt = (n, dec) => n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec })

export function useSiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return
    const cleanups = []

    /* 1. Entrada ao rolar (já visíveis na carga aparecem sem espera) */
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('rv--in')
        io.unobserve(e.target)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    const mark = (sel, cls) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el.classList.contains('rv') || el.classList.contains('rv-wipe')) return
        const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [el]
        el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 90}ms`)
        el.classList.add(cls)
        io.observe(el)
      })
    }
    /* elementos recortados não são "vistos" pelo observer: observa-se o pai */
    const wipeIo = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.querySelectorAll('.rv-wipe').forEach((w) => w.classList.add('rv--in'))
        wipeIo.unobserve(e.target)
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    WIPE.forEach((sel) => document.querySelectorAll(sel).forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.matches(sel))
      el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 5) * 130}ms`)
      el.classList.add('rv-wipe')
      wipeIo.observe(el.parentElement)
    }))
    cleanups.push(() => wipeIo.disconnect())
    REVEAL.forEach((s) => mark(s, 'rv'))
    document.documentElement.classList.add('rv-on')
    cleanups.push(() => io.disconnect())

    /* 2. Valores dos planos contam de zero */
    const prices = [...document.querySelectorAll('.services__price strong')]
    const pio = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        pio.unobserve(e.target)
        const el = e.target
        const m = el.dataset.final.match(/([\d.]+),(\d+)/)
        const target = parseFloat(m[1].replace('.', '') + '.' + m[2])
        const t0 = performance.now()
        const tick = (t) => {
          const p = Math.min((t - t0) / 1300, 1)
          const eased = 1 - Math.pow(1 - p, 4)
          el.textContent = 'R$ ' + fmt(target * eased, 2)
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = el.dataset.final
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.6 })
    prices.forEach((el) => { el.dataset.final = el.textContent; pio.observe(el) })
    cleanups.push(() => pio.disconnect())

    /* 3. Brilho que segue o mouse nos cartões */
    if (window.matchMedia('(hover: hover)').matches) {
      const move = (ev) => {
        const card = ev.target.closest && ev.target.closest(SPOT)
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${ev.clientX - r.left}px`)
        card.style.setProperty('--my', `${ev.clientY - r.top}px`)
      }
      document.querySelectorAll(SPOT).forEach((c) => c.classList.add('spot'))
      document.addEventListener('mousemove', move, { passive: true })
      cleanups.push(() => document.removeEventListener('mousemove', move))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
