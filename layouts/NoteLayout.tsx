import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStore } from 'common/store'
import dayjs from 'dayjs'
import { FC, forwardRef, memo, useCallback } from 'react'
import { Rest } from 'utils'
import { observer } from 'utils/mobx'
import { QueueAnim } from '../components/Anime'

interface NoteLayoutProps {
  title: string
  tips?: string
  date: Date
  bookmark?: boolean
  id: string
}
export const animatingClassName: [string, string] = [
  '',
  'absolute padding-b100',
]

const NoteLayout: FC<NoteLayoutProps> = observer(
  forwardRef(({ children, date, title, tips, bookmark, id }, ref: any) => {
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月DD日 dddd')
    const {
      userStore: { isLogged },
    } = useStore()

    const onMarkToggle = useCallback(() => {
      Rest('Note').update(id, { hasMemory: !bookmark })
    }, [bookmark, id])
    return (
      <main className="is-article is-note post-content kami-note" ref={ref}>
        <QueueAnim
          type={['bottom', 'top']}
          delay={500}
          forcedReplay
          // leaveReverse
          animatingClassName={animatingClassName}
        >
          <article key={dateFormat} className={'note-article'}>
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
            </h2>

            {children}
          </article>
        </QueueAnim>
      </main>
    )
  }),
)

export { NoteLayout }
