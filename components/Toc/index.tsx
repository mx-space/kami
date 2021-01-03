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
import { useRouter } from 'next/router'
import QueueAnim from 'rc-queue-anim'
import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
declare const window: Window & typeof globalThis & { [key: string]: any }

const _Toc: FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [headings, setHeadings] = useState<
    | null
    | {
        id: string
        depth: number
      }[]
  >([])
  const [rootDepth, setDepth] = useState(Infinity)
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
      let _rootDepth = rootDepth
      // @ts-ignore
      const headings = $headings
        .flat<HTMLHeadingElement>(2)
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .map((d: HTMLHeadingElement) => {
          const depth = ~~d.tagName.toLowerCase().slice(1)
          if (depth < _rootDepth) {
            _rootDepth = depth
          }

          return {
            id: d.id,
            depth,
          }
        })
      setDepth(_rootDepth)
      setHeadings(headings.length === 0 ? null : headings)
    }
  }, 20)

  const router = useRouter()
  const { asPath } = router
  useEffect(() => {
    window.addEventListener('resize', setMaxWidth)
    getHeadings()
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [setMaxWidth])

  useEffect(() => {
    setHeadings(null)
    setTimeout(() => {
      getHeadings()
    }, 1000)
  }, [asPath])

  return (
    <section className="kami-lister" style={{ zIndex: 3 }}>
      <div className="container" ref={containerRef}>
        <QueueAnim>
          {headings &&
            headings.map((heading, i) => {
              return (
                <a
                  data-scroll
                  href={'#' + heading.id}
                  key={i}
                  className={styles['toc-link']}
                  style={{
                    paddingLeft:
                      heading.depth > rootDepth
                        ? `${1.2 * heading.depth - rootDepth}rem`
                        : undefined,
                  }}
                  data-depth={heading.depth}
                  onClick={(e) => {
                    if (typeof window.SmoothScroll === 'undefined') {
                      e.preventDefault()
                      const el = document.getElementById(heading.id)
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  <span className={styles['a-pointer']}>
                    {heading.id.slice(heading.id.indexOf('¡') + 1)}
                  </span>
                </a>
              )
            })}
        </QueueAnim>
      </div>
    </section>
  )
})

const Toc = dynamic(() => Promise.resolve(_Toc), {
  ssr: false,
})

export default Toc
