const createDanmakuWrap = () => {
  const $root = document.body
  const $wrap = document.getElementById('dangmaku')
  if (!$wrap) {
    const $wrap = document.createElement('div')
    $wrap.setAttribute('id', 'dangmaku')
    $wrap.style.cssText = `
      position: fixed;
      top: 4rem;
      bottom: 50vh;
      z-index: -1;
      overflow: hidden;
      left: 0;
      right: 0;
    `
    $root.appendChild($wrap)
    return $wrap
  }
  return $wrap
}

interface DanmakuProps {
  color?: string
  duration?: number
  text: string
}

export const createDangmaku = ({ color, duration, text }: DanmakuProps) => {
  const $wrap = createDanmakuWrap()
  const wrapHeight = $wrap.getBoundingClientRect().height
  const dangmaku = document.createElement('div')

  Object.assign<CSSStyleDeclaration, Partial<CSSStyleDeclaration>>(
    dangmaku.style,
    {
      color: color ?? '',
      position: 'absolute',
      fontSize: '16px',
      top: `${Math.floor(Math.random() * (wrapHeight >> 8)) * 14}px`,
    },
  )

  Object.assign(dangmaku, {
    textContent: text,
    onanimationend: (_e) => {
      dangmaku.remove()
    },
  })

  // console.log(dangmaku)

  $wrap.appendChild(dangmaku)

  requestAnimationFrame(() => {
    // dangmaku.style.right = '100vw'
    dangmaku.style.animation = `dangmaku ${
      duration && duration / 1000 > 8 ? duration : 8
    }s steps(30) `
  })
}
