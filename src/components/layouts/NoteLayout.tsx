import { clsx } from 'clsx'
import dayjs from 'dayjs'
import { motion, useAnimationControls } from 'framer-motion'
import type { ReactNode } from 'react'
import { forwardRef, lazy, useCallback, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '~/atoms/app'
import { useNoteCollection } from '~/atoms/collections/note'
import { useIsLogged } from '~/atoms/user'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { SolidBookmark } from '~/components/ui/Icons/for-note'
import {
  FluentEyeHide20Regular,
  RegularBookmark,
} from '~/components/ui/Icons/layout'
import { microReboundPreset } from '~/constants/spring'
import { springScrollToElement } from '~/utils/spring'
import { resolveUrl } from '~/utils/utils'

import { Suspense } from '../app/Suspense'
import { IconTransition } from '../common/IconTransition'
import { AnimateChangeInHeight } from '../ui/AnimateChangeInHeight'
import { Banner } from '../ui/Banner'

const NoteTimelineList = lazy(() =>
  import('~/components/in-page/Note/NoteTimelineList').then((mo) => ({
    default: mo.NoteTimelineList,
  })),
)

const bannerClassNames = {
  info: `bg-sky-50 dark:bg-sky-800 dark:text-white`,
  warning: `bg-orange-100 dark:bg-orange-800 dark:text-white`,
  error: `bg-rose-100 dark:bg-rose-800 dark:text-white`,
  success: `bg-emerald-100 dark:bg-emerald-800 dark:text-white`,
  secondary: `bg-sky-100 dark:bg-sky-800 dark:text-white`,
}
const useNoteMetaBanner = (id: string) => {
  const note = useNoteCollection((state) => {
    const note = state.get(id)
    if (!note) return null
    return { meta: note.meta }
  }, shallow)
  const meta = note?.meta
  let banner = meta?.banner as {
    type: string
    message: string
    className: string
    style?: any
  }

  if (!banner) {
    return
  }
  if (typeof banner === 'string') {
    return {
      type: 'info',
      message: banner,
      className: bannerClassNames.info,
    }
  }
  banner = { ...banner }
  banner.type ??= 'info'
  banner.className ??= bannerClassNames[banner.type]

  return banner
}

interface NoteLayoutProps {
  title: string
  tips?: string
  date: string

  id: string
  children?: ReactNode

  isPreview?: boolean
}

export const NoteLayout = forwardRef<HTMLElement, NoteLayoutProps>(
  (props, ref) => {
    const { date, id, title, tips, children, isPreview = false } = props
    // autocorrect: false
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    // autocorrect: true
    const isLogged = useIsLogged()

    const url = useAppStore((state) => state.appUrl)

    const bookmark = useNoteCollection((state) => state.get(id)?.bookmark)
    const isHide = useNoteCollection(
      (state) => (state.get(id) as { hide?: boolean } | undefined)?.hide,
    )
    const banner = useNoteMetaBanner(id)
    const onMarkToggle = useCallback(async () => {
      await useNoteCollection.getState().bookmark(id)
    }, [id])

    const controller = useAnimationControls()

    useEffect(() => {
      controller.set('from')

      controller.start('to')
    }, [id])

    useEffect(() => {
      setTimeout(() => {
        const hash = location.hash
        if (hash) {
          const el = document.querySelector(
            escapeSelector(decodeURIComponent(hash)),
          ) as HTMLElement

          if (el) {
            springScrollToElement(el)
          }
        }
      }, 1000)
    }, [])

    return (
      <main
        className="is-note relative max-w-[50em]"
        ref={ref}
        suppressHydrationWarning
      >
        <motion.div
          initial={true}
          animate={controller}
          transition={microReboundPreset}
          variants={{
            from: {
              translateY: '-3rem',
              opacity: 0,
            },
            to: {
              translateY: 0,
              opacity: 1,
            },
          }}
        >
          <div className="note-article relative">
            <div className="title-headline dark:text-shizuku-text">
              <span className="inline-flex items-center">
                <time className="font-medium">{dateFormat}</time>
                {!isPreview && (
                  <div className="ml-4 inline-flex items-center space-x-2">
                    {isLogged ? (
                      <IconTransition
                        currentState={bookmark ? 'solid' : 'regular'}
                        regularIcon={
                          <RegularBookmark
                            className="cursor-pointer"
                            onClick={onMarkToggle}
                          />
                        }
                        solidIcon={
                          <SolidBookmark
                            className="text-red cursor-pointer"
                            onClick={onMarkToggle}
                          />
                        }
                      />
                    ) : bookmark ? (
                      <SolidBookmark className="text-red" />
                    ) : null}
                    {isHide && (
                      <FluentEyeHide20Regular
                        className={!isLogged ? 'text-red' : ''}
                      />
                    )}
                  </div>
                )}
              </span>
            </div>

            {isPreview && (
              <Banner className="mt-8" type="info">
                正在处于预览模式
              </Banner>
            )}
            <AnimateChangeInHeight
              className="w900:ml-[-1.25em] w900:mr-[-1.25em] w900:text-sm ml-[calc(-3em)] mr-[calc(-3em)] mt-8"
              duration={0.3}
            >
              {banner && (
                <div
                  className={clsx(
                    'flex justify-center p-4 leading-8',
                    banner.className,
                  )}
                  style={banner.style}
                >
                  {banner.message}
                </div>
              )}
            </AnimateChangeInHeight>

            <div>
              <h1 className="!before:hidden headline dark:text-shizuku-text !mt-8 text-center">
                <FloatPopover
                  triggerComponent={() => <>{title}</>}
                  placement="bottom"
                >
                  {tips}
                </FloatPopover>
                {isLogged && url && !isPreview ? (
                  <a
                    data-hide-print
                    className="edit-link"
                    target="_blank"
                    href={resolveUrl(`#/notes/edit?id=${id}`, url.adminUrl)!} rel="noreferrer"
                  >
                    编辑
                  </a>
                ) : null}
              </h1>

              {children}
            </div>
          </div>
        </motion.div>

        {!isPreview && (
          <Suspense>
            <NoteTimelineList noteId={id} />
          </Suspense>
        )}
      </main>
    )
  },
)

function escapeSelector(selector) {
  return selector.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
}
