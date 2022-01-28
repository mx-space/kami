import spring, { toString } from 'css-spring'
import { isClientSide } from './utils'
const cache = new Map<string, string>()
export type SpringOption = {
  precision?: number
  preset?: 'stiff' | 'gentle' | 'wobbly' | 'noWobble'
  stiffness?: number
  damping?: number
}

export const genSpringKeyframes = (
  name: string,
  from: any,
  to: any,
  options: SpringOption = { preset: 'gentle' },
) => {
  if (!isClientSide() || cache.has(name)) {
    return [name, null, null]
  }

  const transformProperty = [
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'rotate',
  ]
  const keyframes = toString(spring(from, to, options), (property, value) =>
    transformProperty.includes(property)
      ? `transform: ${property}(${value});`
      : `${property}:${value};`,
  )

  const css = document.createElement('style')
  css.innerHTML = `
  @keyframes ${name} {${keyframes}}`
  document.head.appendChild(css)

  cache.set(name, keyframes)

  return [name, css, keyframes]
}

export const springScrollTo = (
  to: number,
  duration = 1000,
  container?: HTMLElement,
) => {
  if (!isClientSide()) {
    return
  }
  const scrollContainer = container || document.documentElement
  const res = spring(
    { top: scrollContainer.scrollTop },
    { top: to },
    { stiffness: 170, damping: 25 },
  )
  let raf: any
  const cancelScroll = () => {
    raf = cancelAnimationFrame(raf)

    scrollContainer.removeEventListener('wheel', cancelScroll)
    scrollContainer.removeEventListener('touchstart', cancelScroll)
  }
  scrollContainer.addEventListener('wheel', cancelScroll)
  scrollContainer.addEventListener('touchstart', cancelScroll, {
    passive: true,
  })

  setTimeout(() => {
    cancelScroll()
  }, duration + 50)
  const ts = +new Date()
  raf = requestAnimationFrame(function an() {
    const current = +new Date()
    const percent = Math.floor(((current - ts) / duration) * 100)

    if (percent > 100) {
      scrollContainer.scrollTop = res[100 + '%'].top
      return
    }
    raf = requestAnimationFrame(an)

    scrollContainer.scrollTop = res[percent + '%'].top
  })
}

export const springScrollToElement = (
  el: HTMLElement,
  duration = 1000,
  offset = 0,
  container?: HTMLElement,
) => {
  if (!isClientSide()) {
    return
  }
  const height = el.getBoundingClientRect().height + offset

  return springScrollTo(height, duration, container)
}
