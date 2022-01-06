import classNames from 'clsx'
import throttle from 'lodash/throttle'
import dynamic from 'next/dynamic'
import QueueAnim from 'rc-queue-anim'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { TocItem } from './item'
export type TocHeading = {
  title: string
  depth: number
}

export type TocProps = {
  headings: TocHeading[]
}

const _Toc: FC<TocProps> = memo(({ headings }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [index, setIndex] = useState(-1)

  useEffect(() => {
    import('scrollama').then((scrollama) => {
      const scroller = scrollama.default()
      scroller
        .setup({
          step: '#write h1, #write h2, #write h3, #write h4, #write h5, #write h6',
          // @ts-ignore
          offset: '10px',
        })
        .onStepEnter(({ element }) => {
          console.log(element.dataset['index'])
          setIndex((element.dataset['index'] as any) | 0)
        })
    })
  }, [])

  const setMaxWidth = throttle(() => {
    if (containerRef.current) {
      containerRef.current.style.maxWidth =
        document.documentElement.getBoundingClientRect().width -
        containerRef.current.getBoundingClientRect().x -
        30 +
        'px'
    }
  }, 14)

  useEffect(() => {
    window.addEventListener('resize', setMaxWidth)

    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [setMaxWidth])

  const handleItemClick = useCallback((i) => {
    setTimeout(() => {
      setIndex(i)
    }, 350)
  }, [])

  return (
    <section
      className={classNames('kami-toc', styles['toc'])}
      style={{ zIndex: 3 }}
    >
      <div
        className={classNames('container', styles['container'])}
        ref={containerRef}
      >
        <QueueAnim className={styles['anime-wrapper']}>
          {headings &&
            headings.map((heading, i) => {
              return (
                <TocItem
                  index={i}
                  onClick={handleItemClick}
                  active={i === index}
                  depth={heading.depth}
                  title={heading.title}
                  key={heading.title}
                  rootDepth={headings.reduce(
                    (d, cur) => Math.min(d, cur.depth),
                    1,
                  )}
                />
              )
            })}
        </QueueAnim>
      </div>
    </section>
  )
})

export const Toc = dynamic(() => Promise.resolve(_Toc), {
  ssr: false,
})
