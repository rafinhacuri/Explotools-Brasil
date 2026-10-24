import Lenis from 'lenis'

const HEADER = 72

function anchorFrom(event: MouseEvent): HTMLAnchorElement | null {
  if (event.defaultPrevented || event.button !== 0) return null
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const link = event.target instanceof Element ? event.target.closest('a') : null
  return link?.getAttribute('href')?.startsWith('#') ? link : null
}

function reset(): void {
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search)
  globalThis.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

export default defineNuxtPlugin((nuxtApp) => {
  history.scrollRestoration = 'manual'
  reset()
  onNuxtReady(reset)

  const calm = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = calm ? null : new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.95 })

  nuxtApp.hook('page:finish', () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else globalThis.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  })

  function jump(target: HTMLElement): void {
    const offset = target.id === 'top' ? 0 : -HEADER
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.6 })
    else target.scrollIntoView({ behavior: 'auto', block: 'start' })
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  document.addEventListener('click', (event) => {
    const link = anchorFrom(event)
    const id = link?.getAttribute('href')?.slice(1)
    const target = id ? document.querySelector<HTMLElement>(`[id="${id}"]`) : null
    if (!target) return
    event.preventDefault()
    jump(target)
  })

  return { provide: { lenis } }
})
