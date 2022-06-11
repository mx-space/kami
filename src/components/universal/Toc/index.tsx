import classNames from 'clsx'
import throttle from 'lodash-es/throttle'
import type { FC } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { eventBus } from 'utils'

import { CustomEventTypes } from '~/types/events'

import { RightLeftTransitionView } from '../Transition/right-left'
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

      const index = Number(el.dataset['index'])

      return {
        depth,
        index: isNaN(index) ? -1 : index,
        title,
      }
    })
  }, [$headings])
  const [index, setIndex] = useState(-1)
  useEffect(() => {
    const handler = (index: number) => {
      setIndex(index)
    }
    eventBus.on(CustomEventTypes.TOC, handler)
    return () => {
      eventBus.off(CustomEventTypes.TOC, handler)
    }
  }, [])

  const setMaxWidth = throttle(() => {
    if (containerRef.current) {
      containerRef.current.style.maxWidth = `${
        document.documentElement.getBoundingClientRect().width -
        containerRef.current.getBoundingClientRect().x -
        30
      }px`
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
    <section className={classNames('kami-toc z-3', styles['toc'])}>
      <div
        className={classNames('container', styles['container'])}
        ref={containerRef}
      >
        <TransitionGroup className={styles['anime-wrapper']}>
          {headings &&
            headings.map((heading, i) => {
              return (
                <RightLeftTransitionView timeout={{ enter: 100 * i }}>
                  <TocItem
                    index={heading.index}
                    onClick={handleItemClick}
                    active={heading.index === index}
                    depth={heading.depth}
                    title={heading.title}
                    key={heading.title}
                    rootDepth={headings.reduce(
                      (d, cur) => Math.min(d, cur.depth),
                      headings[0].depth,
                    )}
                  />
                </RightLeftTransitionView>
              )
            })}
        </TransitionGroup>
      </div>
    </section>
  )
})
