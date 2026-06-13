import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Link } from '~/i18n/navigation'
import type { FC, KeyboardEventHandler } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import useSWR from 'swr'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { EmptyIcon } from '~/components/ui/Icons/for-comment'
import { IonSearch } from '~/components/ui/Icons/layout'
import type { OverlayProps } from '~/components/ui/Overlay'
import { Overlay } from '~/components/ui/Overlay'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDebounceValue } from '~/hooks/common/use-debounce-value'
import { apiClient } from '~/utils/client'

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

type SearchResultItem =
  | {
      type: 'post'
      title: string
      id: string
      slug: string
      category?: {
        name: string
        slug: string
      }
    }
  | {
      type: 'note'
      title: string
      id: string
      nid: number
    }
  | {
      type: 'page'
      title: string
      id: string
      slug: string
    }

type SearchResultResponse = {
  data: SearchResultItem[]
}

export const SearchPanel: FC<SearchPanelProps> = (props) => {
  const { defaultKeyword } = props
  const [keyword, setKeyword] = useState(defaultKeyword || '')
  const debouncedKeyword = useDebounceValue(keyword, 360)

  const [list, setList] = useState<SearchListType[]>([])
  const { event } = useAnalyze()

  const { data, isValidating, isLoading } = useSWR(
    ['search', debouncedKeyword],
    ([, keyword]) => {
      if (!keyword) {
        return
      }
      return apiClient.search.searchAll(
        keyword,
      ) as unknown as Promise<SearchResultResponse>
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  )

  const loading = isLoading || isValidating

  useEffect(() => {
    if (!debouncedKeyword) {
      setCurrentSelect(0)
      setList([])
      return
    }

    if (!data?.data) {
      return
    }

    const _list = data.data.reduce<SearchListType[]>((acc, item) => {
      switch (item.type) {
        case 'post': {
          if (!item.category) {
            return acc
          }
          acc.push({
            title: item.title,
            subtitle: item.category.name,
            id: item.id,
            url: `/posts/${item.category.slug}/${item.slug}`,
          })
          return acc
        }
        case 'note': {
          acc.push({
            title: item.title,
            subtitle: '手记',
            id: item.id,
            url: `/notes/${item.nid}`,
          })
          return acc
        }
        case 'page': {
          acc.push({
            title: item.title,
            subtitle: '页面',
            id: item.id,
            url: `/${item.slug}`,
          })
          return acc
        }
      }
    }, [])
    setCurrentSelect(0)
    setList(_list)
  }, [data?.data, debouncedKeyword])

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
    <motion.div
      className={styles['root']}
      onKeyDown={handleKeyDown}
      role="dialog"
      initial={{
        translateY: 20,
      }}
      exit={{
        translateY: 20,
      }}
      animate={{
        translateY: 0,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 10,
        },
      }}
    >
      <input
        autoFocus
        className="w-full bg-transparent p-4 px-5 text-[16px] leading-4"
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
      />
      <div className="overflow-overlay relative shrink grow">
        <ul className="h-full px-3 py-4" ref={listRef}>
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
                  onMouseOver={() => setCurrentSelect(index)}
                >
                  <Link
                    href={item.url}
                    className={clsx(
                      styles['item'],
                      index === currentSelect && styles['active'],
                    )}
                  >
                    <span className="block flex-1 shrink-0 truncate">
                      {item.title}
                    </span>
                    <span className="text-deepgray text-theme-gray-2 block shrink-0 grow-0">
                      {item.subtitle}
                    </span>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </motion.div>
  )
}
export const SearchOverlay: FC<OverlayProps> = (props) => {
  const { ...rest } = props

  const isMobile = useAppStore((state) => state.viewport.mobile)

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
    <Overlay
      center={!isMobile}
      standaloneWrapperClassName={clsx(
        isMobile && 'items-start justify-center',
      )}
      {...rest}
    >
      <div
        className={clsx(
          'transition-opacity duration-200',
          !props.show && 'opacity-0',
        )}
      >
        <SearchPanel />
      </div>
    </Overlay>
  )
}
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
export const SearchFAB = () => {
  const [show, setShow] = useState(false)
  const actionId = useRef('search-fab')
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
    const actionStore = useActionStore.getState()
    actionStore.removeActionById(actionId.current)
    const action = {
      icon: <IonSearch />,
      id: actionId.current,
      onClick: () => {
        setShow(true)
      },
    }
    requestAnimationFrame(() => {
      actionStore.appendActions(action)
    })

    return () => {
       
      actionStore.removeActionById(actionId.current)
    }
     
  }, [])

  return <SearchOverlay show={show} onClose={() => setShow(false)} />
}
