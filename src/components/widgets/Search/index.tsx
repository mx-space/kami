import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link, useLocale } from '~/i18n/navigation'
import type { FC, KeyboardEventHandler } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import {
  getHighlightSegments,
  toSearchListItems,
  type SearchResultResponse,
} from './utils'

export type SearchPanelProps = {
  defaultKeyword?: string
}

export const SearchPanel: FC<SearchPanelProps> = (props) => {
  const { defaultKeyword } = props
  const [keyword, setKeyword] = useState(defaultKeyword || '')
  const trimmedKeyword = keyword.trim()
  const debouncedKeyword = useDebounceValue(trimmedKeyword, 360)
  const locale = useLocale()
  const t = useTranslations('search')
  const { event } = useAnalyze()

  const isDebouncing =
    trimmedKeyword.length > 0 && trimmedKeyword !== debouncedKeyword
  const searchKey =
    trimmedKeyword.length > 0 && !isDebouncing
      ? (['search', locale, debouncedKeyword] as const)
      : null
  const { data, error, isValidating, isLoading, mutate } = useSWR(
    searchKey,
    ([, , searchKeyword]) => {
      return apiClient.search.searchAll(
        searchKeyword,
      ) as unknown as Promise<SearchResultResponse>
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  )

  const loading = isDebouncing || isLoading || isValidating
  const list = useMemo(
    () =>
      toSearchListItems(data?.data, {
        note: t('note'),
        page: t('page'),
      }),
    [data?.data, t],
  )

  const [currentSelect, setCurrentSelect] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setCurrentSelect(0)
  }, [list, trimmedKeyword])

  const trackerOne = useRef(false)
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!listRef.current || list.length === 0) {
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
          const selectedItem = $.children.item(
            currentSelect,
          ) as HTMLLIElement | null
          selectedItem?.querySelector('a')?.click()
          tracker()
          break
        }
        case 'ArrowDown': {
          const nextIndex = (currentSelect + 1) % list.length
          setCurrentSelect(nextIndex)
          $.children.item(nextIndex)?.scrollIntoView({
            behavior: 'smooth',
          })
          tracker()
          break
        }
        case 'ArrowUp': {
          const nextIndex =
            currentSelect - 1 < 0 ? list.length - 1 : currentSelect - 1
          setCurrentSelect(nextIndex)
          $.children.item(nextIndex)?.scrollIntoView({
            behavior: 'smooth',
          })
          tracker()
          break
        }
        default:
          return
      }
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
        aria-label={t('inputLabel')}
        placeholder={t('placeholder')}
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
          {!trimmedKeyword ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <IonSearch className="text-[60px]" />
                <span>{t('placeholder')}</span>
              </div>
            </div>
          ) : error ? (
            <div
              className="flex h-full flex-col items-center justify-center space-y-3"
              role="alert"
            >
              <EmptyIcon />
              <span>{t('failed')}</span>
              <button
                className="rounded-md bg-gray-4 px-3 py-1 transition-opacity hover:opacity-80"
                type="button"
                onClick={() => void mutate()}
              >
                {t('retry')}
              </button>
            </div>
          ) : loading ? (
            <div
              className="flex h-full items-center justify-center"
              role="status"
            >
              <span>{t('loading')}</span>
            </div>
          ) : list.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <EmptyIcon />
                <span>{t('noResults')}</span>
              </div>
            </div>
          ) : (
            list.map((item, index) => {
              return (
                <li key={item.id} onMouseOver={() => setCurrentSelect(index)}>
                  <Link
                    href={item.url}
                    className={clsx(
                      styles['item'],
                      index === currentSelect && styles['active'],
                    )}
                  >
                    <span className="block min-w-0 flex-1 shrink-0">
                      <HighlightText
                        className="block truncate"
                        keywords={item.highlight?.keywords}
                        text={item.title}
                      />
                      {item.highlight?.snippet && (
                        <HighlightText
                          className="text-deepgray mt-1 line-clamp-2 block text-sm"
                          keywords={item.highlight.keywords}
                          text={item.highlight.snippet}
                        />
                      )}
                    </span>
                    <span className="text-deepgray text-theme-gray-2 ml-4 flex shrink-0 grow-0 flex-col items-end gap-1">
                      {item.subtitle}
                      {item.isFallback && (
                        <span className="text-xs">{t('fallback')}</span>
                      )}
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

const HighlightText: FC<{
  className?: string
  keywords?: readonly string[]
  text: string
}> = ({ className, keywords, text }) => {
  const segments = getHighlightSegments(text, keywords)

  return (
    <span className={className}>
      {segments.map((segment) =>
        segment.highlighted ? (
          <mark className={styles['highlight']} key={segment.key}>
            {segment.text}
          </mark>
        ) : (
          <span key={segment.key}>{segment.text}</span>
        ),
      )}
    </span>
  )
}

export const SearchOverlay: FC<OverlayProps> = (props) => {
  const { ...rest } = props

  const isMobile = useAppStore((state) => state.viewport.mobile)
  const t = useTranslations('search')

  useShortcut(
    'Escape',
    [Modifier.None],
    () => {
      props.onClose()
    },
    t('close'),
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
  const t = useTranslations('search')
  const handler = () => {
    event({ action: TrackerAction.Click, label: 'cmd+k' })
    setShow(true)
  }
  useShortcut('K', [Modifier.Command], handler, t('open'))
  useShortcut('K', [Modifier.Control], handler, t('open'), {
    hiddenInPanel: true,
  })
  useShortcut('/', [Modifier.None], handler, t('open'))

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
