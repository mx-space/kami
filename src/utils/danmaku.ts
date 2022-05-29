/*
 * @Author: Innei
 * @Date: 2020-05-28 12:24:14
 * @LastEditTime: 2020-06-07 16:22:18
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/danmaku.ts
 * @Copyright
 */
import range from 'lodash-es/range'
import sample from 'lodash-es/sample'

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
      top: `${sample(range(0, wrapHeight >> 8) as any) * 14}px`,
    },
  )

  Object.assign(dangmaku, {
    textContent: text,
    onanimationend: (e) => {
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
