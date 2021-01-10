/*
 * @Author: Innei
 * @Date: 2020-06-12 21:41:12
 * @LastEditTime: 2021-01-10 11:03:04
 * @LastEditors: Innei
 * @FilePath: /web/components/Toc/index.tsx
 * @Coding with Love
 */

import classNames from 'classnames'
import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import QueueAnim from 'rc-queue-anim'
import { FC, memo, PureComponent, useEffect, useRef, useState } from 'react'
import observable from 'utils/observable'
import styles from './index.module.scss'
declare const window: Window & typeof globalThis & { [key: string]: any }

class Item extends PureComponent<{
  id: string
  depth: number
  active: boolean
  rootDepth: number
  onClick: () => void
}> {
  // componentDidUpdate() {}
  render() {
    const { active, depth, id, rootDepth, onClick } = this.props

    return (
      <a
        data-scroll
        href={'#' + id}
        data-index={id.split('¡').shift()}
        className={classNames(styles['toc-link'], active && styles['active'])}
        style={{
          paddingLeft:
            depth > rootDepth ? `${1.2 * depth - rootDepth}rem` : undefined,
        }}
        data-depth={depth}
        onClick={(e) => {
          onClick()
          if (typeof window.SmoothScroll === 'undefined') {
            e.preventDefault()
            const el = document.getElementById(id)
            el?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <span className={styles['a-pointer']}>
          {id.slice(id.indexOf('¡') + 1)}
        </span>
      </a>
    )
  }
}

const _Toc: FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const handler = throttle(() => {
  //     const top = document.body.scrollTop
  //     headings?.some((h) => h.top > top)
  //   }, 30)

  //   window.addEventListener('scroll', handler)

  //   return () => {
  //     window.removeEventListener('scroll', handler)
  //   }
  // }, [])
  const [index, setIndex] = useState(-1)
  useEffect(() => {
    const handler = (index: number) => {
      setIndex(index)
    }
    observable.on('toc', handler)
    return () => {
      observable.off('toc', handler)
    }
  }, [])

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
            isActive: false,
            // @ts-ignore
            // top: ~~d.dataset['offset'] as number,
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

  useEffect(() => {
    const handler = (e) => {
      try {
        // @ts-ignore
        const index = parseInt(e.detail.toggle as HTMLElement).dataset['index']
        if (!isNaN(index)) {
          setIndex(index)
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }
    document.addEventListener('scrollStop', handler, false)
    return () => {
      document.removeEventListener('scrollStop', handler, false)
    }
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
                <Item
                  onClick={() => {
                    setTimeout(() => {
                      setIndex(i)
                    }, 350)
                  }}
                  active={i === index}
                  depth={heading.depth}
                  id={heading.id}
                  key={heading.id}
                  rootDepth={rootDepth}
                />
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
