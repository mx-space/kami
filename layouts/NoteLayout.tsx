/*
 * @Author: Innei
 * @Date: 2021-01-07 20:13:09
 * @LastEditTime: 2021-01-23 20:35:34
 * @LastEditors: Innei
 * @FilePath: /web/layouts/NoteLayout.tsx
 * @Mark: Coding with Love
 */
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStore } from 'common/store'
import dayjs from 'dayjs'
import { FC, forwardRef, useCallback } from 'react'
import { Transition } from 'react-transition-group'
import { NoSSR, resolveUrl, Rest } from 'utils'
import { observer } from 'utils/mobx'
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
const _NoteLayout: FC<NoteLayoutProps> = observer(
  forwardRef(({ children, date, title, tips, bookmark, id }, ref: any) => {
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    const {
      userStore: { isLogged, url },
    } = useStore()

    const onMarkToggle = useCallback(() => {
      Rest('Note').update(id, { hasMemory: !bookmark })
    }, [bookmark, id])
    const noAppear = location.hash.includes('comments')
    return (
      <main className="is-article is-note post-content kami-note" ref={ref}>
        {/* <QueueAnim
          type={['bottom', 'top']}
          delay={500}
          forcedReplay
          // leaveReverse
          animatingClassName={animatingClassName}
        > */}
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
        {/* </QueueAnim> */}
      </main>
    )
  }),
)
const NoteLayout = NoSSR(_NoteLayout)
export { NoteLayout }
