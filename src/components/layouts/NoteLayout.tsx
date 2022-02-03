import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NoteTimelineList } from 'components/in-page/NoteTimelineList'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { ReactNode, useCallback } from 'react'
import { useStore } from 'store'
import { resolveUrl } from 'utils'
import { apiClient } from 'utils/client'
interface NoteLayoutProps {
  title: string
  tips?: string
  date: Date
  bookmark?: boolean
  id: string
  children?: ReactNode
}

export const NoteLayout = observer<NoteLayoutProps, HTMLElement>(
  (props, ref) => {
    const { date, id, bookmark, title, tips, children } = props
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    const {
      userStore: { isLogged, url },
    } = useStore()

    const onMarkToggle = useCallback(() => {
      apiClient.note.proxy(id).patch({ data: { bookmark: !bookmark } })
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
          <article className={'note-article main-article-md relative'}>
            <h1>
              {dateFormat}
              <div className="ml-4 inline-block">
                {isLogged ? (
                  <FontAwesomeIcon
                    icon={bookmark ? faBookmarkSolid : faBookmark}
                    color={bookmark ? 'red' : undefined}
                    className="cursor-pointer"
                    onClick={onMarkToggle}
                  />
                ) : bookmark ? (
                  <FontAwesomeIcon icon={faBookmarkSolid} color="red" />
                ) : null}
              </div>
            </h1>

            <h2 title={tips} className="text-center">
              {title}
              {isLogged && url ? (
                <a
                  className="edit-link"
                  target="_blank"
                  href={resolveUrl('/#/notes/edit?id=' + id, url.adminUrl)!}
                >
                  编辑
                </a>
              ) : null}
            </h2>

            {children}
          </article>
        </BottomUpTransitionView>

        <NoteTimelineList noteId={id} />
      </main>
    )
  },
  { forwardRef: true },
)
