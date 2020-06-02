import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import dynamic from 'next/dynamic'
import QueueAnim from 'rc-queue-anim'
import { FC, useEffect, useRef, useState } from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import styles from './index.module.scss'

export const Toc: FC = () => {
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
    <section className="paul-lister" style={{ zIndex: -1 }}>
      <div className="container" ref={containerRef}>
        <QueueAnim>
          {headings &&
            headings.map((heading, i) => {
              return (
                <AnchorLink
                  offset={() => 200}
                  href={'#' + heading}
                  key={i}
                  className={styles['toc-link']}
                >
                  <span className={styles['a-pointer']}>
                    {heading.slice(heading.indexOf('¡') + 1)}
                  </span>
                </AnchorLink>
              )
            })}
        </QueueAnim>
      </div>
    </section>
  )
}
export default (dynamic(() => import('.').then((m) => m.Toc) as any, {
  ssr: false,
}) as any) as typeof Toc
