/*
 * @Author: Innei
 * @Date: 2020-05-28 12:24:14
 * @LastEditTime: 2020-05-28 19:10:28
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/danmaku.ts
 * @Copyright
 */
import range from 'lodash/range'
import sample from 'lodash/sample'
import observable from './observable'
import { EventTypes } from 'socket/types'
const createDanmakuWrap = () => {
  const $root = document.documentElement
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
  dangmaku.textContent = text
  dangmaku.style.color = color ?? ''
  dangmaku.style.position = 'absolute'
  dangmaku.style.fontSize = '14px'
  dangmaku.style.top =
    sample(range(0, Math.floor(wrapHeight / 16)) as any) * 14 + 'px'

  // dangmaku.style.right = '0'
  // dangmaku.style.transition =
  //   'right ' + (duration && duration / 1000 > 8 ? duration : 8) + 's linear'
  // dangmaku.style.transform = 'translateX(100%)'
  dangmaku.onanimationend = (e) => {
    dangmaku.remove()
  }
  $wrap.appendChild(dangmaku)

  requestAnimationFrame(() => {
    // dangmaku.style.right = '100vw'
    dangmaku.style.animation =
      `dangmaku ` +
      (duration && duration / 1000 > 8 ? duration : 8) +
      's linear'
  })
}

export const listenerInit = () => {
  observable.on(
    EventTypes.DANMAKU_CREATE,
    (data: DanmakuProps & { author: string }) => {
      createDangmaku({
        text: data.author + ': ' + data.text,
        color: data.color,
      })
    },
  )
}
