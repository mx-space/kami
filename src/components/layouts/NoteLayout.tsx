import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import type { ReactNode } from 'react'
import { forwardRef, useCallback } from 'react'
import { resolveUrl } from 'utils'

import { NoteTimelineList } from '~/components/in-page/Note/NoteTimelineList'
import { FloatPopover } from '~/components/universal/FloatPopover'
import {
  FluentEyeHide20Regular,
  RegularBookmark,
  SolidBookmark,
} from '~/components/universal/Icons'
import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
import { useStore } from '~/store'
import { apiClient } from '~/utils/client'

interface NoteLayoutProps {
  title: string
  tips?: string
  date: string

  id: string
  children?: ReactNode
}

export const NoteLayout = observer<NoteLayoutProps, HTMLElement>(
  forwardRef((props, ref) => {
    const { date, id, title, tips, children } = props
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    const {
      userStore: { isLogged, url },
      noteStore,
    } = useStore()
    const note = noteStore.get(id)
    const bookmark = note?.hasMemory
    const onMarkToggle = useCallback(async () => {
      await apiClient.note.proxy(id).patch({ data: { hasMemory: !bookmark } })
    }, [bookmark, id])
    const noAppear = globalThis.location ? location.hash : false
    return (
      <main className="max-w-[50em] relative is-note" ref={ref}>
        <BottomUpTransitionView
          id={id}
          in={true}
          appear={!noAppear}
          mountOnEnter
          unmountOnExit
          timeout={0}
        >
          <div className={'note-article relative'}>
            <div className="title-headline text-light-brown dark:text-shizuku-text">
              <span className="inline-flex items-center">
                <time className="font-medium">{dateFormat}</time>
                <div className="ml-4 inline-flex space-x-2 items-center">
                  {isLogged ? (
                    bookmark ? (
                      <SolidBookmark
                        className="text-red cursor-pointer"
                        onClick={onMarkToggle}
                      />
                    ) : (
                      <RegularBookmark
                        className="cursor-pointer"
                        onClick={onMarkToggle}
                      />
                    )
                  ) : bookmark ? (
                    <SolidBookmark className="text-red" />
                  ) : null}
                  {note?.hide && (
                    <FluentEyeHide20Regular
                      className={!isLogged ? 'text-red' : ''}
                    />
                  )}
                </div>
              </span>
            </div>
            <div>
              <h1 className="text-center !mt-8 !before:hidden headline text-brown dark:text-shizuku-text">
                <FloatPopover
                  triggerComponent={() => <>{title}</>}
                  placement="bottom"
                >
                  {tips}
                </FloatPopover>
                {isLogged && url ? (
                  <a
                    className="edit-link"
                    target="_blank"
                    href={resolveUrl(`#/notes/edit?id=${id}`, url.adminUrl)!}
                  >
                    编辑
                  </a>
                ) : null}
              </h1>

              {children}
            </div>
          </div>
        </BottomUpTransitionView>

        <NoteTimelineList noteId={id} />
      </main>
    )
  }),
)
