/*
 * @Author: Innei
 * @Date: 2020-06-12 21:41:12
 * @LastEditTime: 2020-08-21 20:44:25
 * @LastEditors: Innei
 * @FilePath: /mx-web/components/Toc/index.tsx
 * @Coding with Love
 */

import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import dynamic from 'next/dynamic'
import QueueAnim from 'rc-queue-anim'
import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
declare const window: Window & typeof globalThis & { [key: string]: any }

export const Toc: FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [headings, setHeadings] = useState<null | string[]>([])
  const setMaxWidth = throttle(() => {
    if (containerRef.current) {
      containerRef.current.style.maxWidth =
        document.documentElement.getBoundingClientRect().width -
        containerRef.current.getBoundingClientRect().x -
        30 +
        'px'
    }
  }, 14)
  const getHeadings = throttle(() => {
    const $write = document.getElementById('write')
    if (!$write) {
      return getHeadings()
    }
    setMaxWidth()

    const $headings = range(1, 6).map((h) =>
      Array.from($write.querySelectorAll('h' + h)),
    ) as HTMLHeadingElement[][]
    if (isNull(headings)) {
      return
    }
    if (headings.length === 0) {
      // @ts-ignore
      const headings = $headings
        .flat<HTMLHeadingElement>(2)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .map((d: HTMLHeadingElement) => d.id)
      setHeadings(headings.length === 0 ? null : headings)
    }
  }, 20)
  useEffect(() => {
    try {
      setTimeout(() => {
        getHeadings()
        window.addEventListener('resize', setMaxWidth)
      }, 1000)
      // eslint-disable-next-line no-empty
    } catch {}
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  })

  return (
    <section className="paul-lister" style={{ zIndex: 3 }}>
      <div className="container" ref={containerRef}>
        <QueueAnim>
          {headings &&
            headings.map((heading, i) => {
              return (
                <a
                  data-scroll
                  href={'#' + heading}
                  key={i}
                  className={styles['toc-link']}
                  onClick={(e) => {
                    if (typeof window.SmoothScroll === 'undefined') {
                      e.preventDefault()
                      const el = document.getElementById(heading)
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  <span className={styles['a-pointer']}>
                    {heading.slice(heading.indexOf('¡') + 1)}
                  </span>
                </a>
              )
            })}
        </QueueAnim>
      </div>
    </section>
  )
})
export default (dynamic(() => import('.').then((m) => m.Toc) as any, {
  ssr: false,
}) as any) as typeof Toc
