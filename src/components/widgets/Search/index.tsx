import { CanceledError } from 'axios'
import clsx from 'clsx'
import { throttle } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC, KeyboardEventHandler } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'

import { EmptyIcon, IonSearch } from '~/components/universal/Icons'
import type { OverlayProps } from '~/components/universal/Overlay'
import { OverLay } from '~/components/universal/Overlay'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { $axios, apiClient } from '~/utils/client'

import styles from './index.module.css'

export type SearchPanelProps = {
  defaultKeyword?: string
}

type SearchListType = {
  title: string
  subtitle?: string
  url: string
  id: string
}

let controller: AbortController | null
const search = throttle((keyword: string) => {
  return new Promise<
    | Awaited<ReturnType<typeof apiClient.search.searchByAlgolia>>
    | null
    | undefined
  >((resolve, reject) => {
    if (!keyword) {
      resolve(null)
      return
    }

    if (controller) {
      controller.abort()
    }

    controller = new AbortController()

    $axios
      .get<Awaited<ReturnType<typeof apiClient.search.searchByAlgolia>>>(
        apiClient.search.proxy('algolia').toString(true),
        {
          signal: controller.signal,
          params: {
            keyword,
          },
        },
      )
      .then((data) => {
        resolve(data.data)
      })
      .catch((err) => {
        if (!err) {
          return resolve(undefined)
        }
        if (err instanceof CanceledError) {
          return resolve(undefined)
        }
        reject(err)
      })
  })
}, 1000)

export const SearchPanel: FC<SearchPanelProps> = memo((props) => {
  const { defaultKeyword } = props
  const [keyword, setKeyword] = useState(defaultKeyword || '')

  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<SearchListType[]>([])
  const { event } = useAnalyze()
  useEffect(() => {
    if (!keyword) {
      return
    }
    setLoading(true)
    setCurrentSelect(0)

    search(keyword)
      ?.then((res) => {
        if (typeof res === 'undefined') {
          return
        }

        event({
          action: TrackerAction.Interaction,
          label: `搜索触发：${keyword}`,
        })
        if (res === null) {
          setLoading(false)
          setList([])
          return
        }
        const data = res.data
        if (!data) {
          setLoading(false)
          return
        }
        const _list: SearchListType[] = data.map((item) => {
          switch (item.type) {
            case 'post':
              return {
                title: item.title,
                subtitle: item.category.name,
                id: item.id,
                url: `/posts/${item.category.slug}/${item.slug}`,
              }
            case 'note':
              return {
                title: item.title,
                subtitle: '生活记录',
                id: item.id,
                url: `/notes/${item.nid}`,
              }
            case 'page':
              return {
                title: item.title,
                subtitle: '页面',
                id: item.id,
                url: `/pages/${item.slug}`,
              }
          }
        })

        setList(_list)

        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [keyword])

  const [currentSelect, setCurrentSelect] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const trackerOne = useRef(false)
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!listRef.current) {
        return
      }
      const $ = listRef.current

      const tracker = () => {
        if (trackerOne.current) {
          return
        }

        event({
          action: TrackerAction.Interaction,
          label: `搜索触发键盘操作：${e.key}`,
        })
        trackerOne.current = true
      }
      switch (e.key) {
        case 'Enter': {
          ;(
            ($.children.item(currentSelect) as HTMLLIElement).children.item(
              0,
            ) as HTMLLinkElement
          )?.click()
          tracker()
          break
        }
        case 'ArrowDown': {
          setCurrentSelect((currentSelect) => {
            const index = currentSelect + 1
            return index ? index % list.length : 0
          })
          tracker()
          break
        }
        case 'ArrowUp': {
          setCurrentSelect((currentSelect) => {
            const index = currentSelect - 1
            return index < 0 ? list.length - 1 : index
          })
          tracker()
          break
        }
      }

      $.children.item(currentSelect)?.scrollIntoView({
        behavior: 'smooth',
      })
    },
    [currentSelect, list.length],
  )

  return (
    <div className={styles['root']} onKeyDown={handleKeyDown} role="dialog">
      <input
        autoFocus
        className="p-4 px-5 w-full text-[16px] leading-4 bg-transparent"
        placeholder="Search..."
        defaultValue={defaultKeyword}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === 'ArrowDown' ||
            e.key === 'ArrowUp' ||
            e.key === 'Enter'
          ) {
            e.preventDefault()
          }
        }}
      />
      <div
        className={clsx(styles['status-bar'], loading && styles['loading'])}
      ></div>
      <div className="flex-grow flex-shrink relative overflow-overlay">
        <ul className="py-4 px-3 h-full" ref={listRef}>
          {list.length === 0 && !loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                {!keyword ? (
                  <IonSearch className="text-[60px]" />
                ) : !loading ? (
                  <EmptyIcon />
                ) : null}
                <span>{keyword && '无内容'}</span>
              </div>
            </div>
          ) : (
            list.map((item, index) => {
              return (
                <li
                  key={item.id}
                  onMouseOver={throttle(() => {
                    setCurrentSelect(index)
                  }, 40)}
                >
                  <Link href={item.url}>
                    <a
                      className={clsx(
                        styles['item'],
                        index === currentSelect && styles['active'],
                      )}
                    >
                      <span className="block flex-1 flex-shrink-0 truncate">
                        {item.title}
                      </span>
                      <span className="text-gray-2 block text-deepgray flex-grow-0 flex-shrink-0">
                        {item.subtitle}
                      </span>
                    </a>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
})
export const SearchOverlay: FC<OverlayProps> = observer((props) => {
  const { ...rest } = props

  const {
    appUIStore: {
      viewport: { mobile },
    },
  } = useStore()
  useShortcut(
    'Escape',
    [Modifier.None],
    () => {
      props.onClose()
    },
    '关闭搜索框',
    { hiddenInPanel: true },
  )
  return (
    <OverLay
      childrenOutside
      center={!mobile}
      standaloneWrapperClassName={clsx(mobile && 'items-start justify-center')}
      {...rest}
    >
      <div
        className={clsx(
          'transition duration-300 transition-opacity',
          !props.show && 'opacity-0',
        )}
      >
        <SearchPanel />
      </div>
    </OverLay>
  )
})
export const SearchHotKey: FC = memo(() => {
  const { event } = useAnalyze()
  const [show, setShow] = useState(false)
  const handler = () => {
    event({ action: TrackerAction.Click, label: 'cmd+k' })
    setShow(true)
  }
  useShortcut('K', [Modifier.Command], handler, '搜索')
  useShortcut('K', [Modifier.Control], handler, '搜索', { hiddenInPanel: true })
  useShortcut('/', [Modifier.None], handler, '搜索')

  return <SearchOverlay show={show} onClose={() => setShow(false)} />
})

export const SearchFAB = memo(() => {
  const [show, setShow] = useState(false)
  const { actionStore } = useStore()
  const idSymbol = useRef(Symbol())
  const { event } = useAnalyze()
  useEffect(() => {
    if (show) {
      event({
        action: TrackerAction.Impression,
        label: `搜索框被唤醒`,
      })
    }
  }, [show])
  useEffect(() => {
    actionStore.removeActionBySymbol(idSymbol.current)
    const action = {
      icon: <IonSearch />,
      id: idSymbol.current,
      onClick: () => {
        setShow(true)
      },
    }
    requestAnimationFrame(() => {
      actionStore.appendActions(action)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      actionStore.removeActionBySymbol(idSymbol.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <SearchOverlay show={show} onClose={() => setShow(false)} />
})
