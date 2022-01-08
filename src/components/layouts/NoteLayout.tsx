import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { Transition } from 'react-transition-group'
import { useStore } from 'store'
import { NoSSR, resolveUrl } from 'utils'
import { apiClient } from 'utils/client'
interface NoteLayoutProps {
  title: string
  tips?: string
  date: Date
  bookmark?: boolean
  id: string
}
export const animatingClassName: [string, string] = [
  '',
  'absolute padding-b100 max-w-full',
]
const defaultStyle = {
  transition: `transform ${280}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease`,
  transform: `translateY(3em)`,
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: `translateY(3em)`, opacity: 0 },
  entered: { transform: `translateY(0)`, opacity: 1 },
  exiting: { transform: `translateY(0)`, opacity: 1 },
  exited: { transform: `translateY(3em)`, opacity: 0 },
}
const _NoteLayout = observer<NoteLayoutProps, HTMLElement>(
  (props, ref) => {
    const { date, id, bookmark, title, tips, children } = props
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    const {
      userStore: { isLogged, url },
    } = useStore()

    const onMarkToggle = useCallback(() => {
      apiClient.note.proxy(id).patch({ data: { bookmark: !bookmark } })
    }, [bookmark, id])
    const noAppear = location.hash.includes('comments')
    return (
      <main className="is-article is-note post-content kami-note" ref={ref}>
        <Transition
          key={id}
          in={true}
          appear={!noAppear}
          mountOnEnter
          unmountOnExit
          timeout={0}
        >
          {(state) => {
            return (
              <article
                key={id}
                className={'note-article'}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                <h1>
                  {dateFormat}
                  <div style={{ marginLeft: '1rem', display: 'inline-block' }}>
                    {isLogged ? (
                      <FontAwesomeIcon
                        icon={bookmark ? faBookmarkSolid : faBookmark}
                        color={bookmark ? 'red' : undefined}
                        style={{ cursor: 'pointer' }}
                        onClick={onMarkToggle}
                      />
                    ) : bookmark ? (
                      <FontAwesomeIcon icon={faBookmarkSolid} color="red" />
                    ) : null}
                  </div>
                </h1>

                <h2 title={tips} style={{ textAlign: 'center' }}>
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
            )
          }}
        </Transition>
      </main>
    )
  },
  { forwardRef: true },
)
const NoteLayout = NoSSR(_NoteLayout)
export { NoteLayout }
