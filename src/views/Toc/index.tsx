import classNames from 'clsx'
import throttle from 'lodash/throttle'
import QueueAnim from 'rc-queue-anim'
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import scrollama from 'scrollama'
import styles from './index.module.css'
import { TocItem } from './item'
export type TocHeading = {
  title: string
  depth: number
}

export type TocProps = {
  headings: HTMLElement[]
}

export const Toc: FC<TocProps> = memo(({ headings: $headings }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headings = useMemo(() => {
    return Array.from($headings).map((el) => {
      const depth = +el.tagName.slice(1)
      const title = el.id

      return {
        depth,
        title,
      }
    })
  }, [$headings])
  const [index, setIndex] = useState(-1)
  // const beforeIndex = useRef(index)

  useEffect(() => {
    const scroller = scrollama()
    // TODO: set index if scroll direction is up
    scroller
      .setup({
        step: $headings,
        offset: 0.5,
      })
      .onStepEnter(({ element, direction }) => {
        // console.log(element.dataset['index'])
        setIndex((element.dataset['index'] as any) | 0)
        // setIndex((prev) => {
        //   beforeIndex.current = prev
        //   return (element.dataset['index'] as any) | 0
        // })
      })
    // .onStepExit(({ element, direction }) => {
    //   if (direction === 'up') {
    //     setIndex(((element.dataset['index'] as any) | 0) - 1)
    //   }
    // })

    return () => {
      scroller.destroy()
    }
  }, [$headings])

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
