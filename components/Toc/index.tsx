import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import dynamic from 'next/dynamic'
import QueueAnim from 'rc-queue-anim'
import { FC, useEffect, useRef, useState } from 'react'
import { Link } from 'react-scroll'
import styles from './index.module.scss'

export const Toc: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [headings, setHeadings] = useState<null | string[]>([])
  const getHeadings = throttle(() => {
    const $write = document.getElementById('write')
    if (!$write) {
      return getHeadings()
    }
    if (containerRef.current) {
      containerRef.current.style.maxWidth =
        document.documentElement.getBoundingClientRect().width -
        containerRef.current.getBoundingClientRect().x -
        30 +
        'px'
    }

    const $headings = range(1, 6).map((h) =>
      Array.from($write.querySelectorAll('h' + h)),
    )
    if (isNull(headings)) {
      return
    }
    if (headings.length === 0) {
      const headings = $headings
        .flat(2)
        .map((d: HTMLHeadingElement) => d.innerText)
      setHeadings(headings.length === 0 ? null : headings)
    }
  }, 20)
  useEffect(() => {
    setTimeout(() => {
      getHeadings()
    }, 1000)
  })

  return (
    <section className="paul-lister">
      <div className="container" ref={containerRef}>
        <QueueAnim>
          {headings &&
            headings.map((heading, i) => {
              return (
                <Link
                  to={heading}
                  key={i}
                  offset={-100}
                  activeClass={styles['active']}
                  className={styles['toc-link']}
                >
                  <span className={styles['a-pointer']}>{heading}</span>
                </Link>
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
