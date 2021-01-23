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
import { resolveUrl, Rest } from 'utils'
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
  'absolute padding-b100 max-w-full',
]

const NoteLayout: FC<NoteLayoutProps> = observer(
  forwardRef(({ children, date, title, tips, bookmark, id }, ref: any) => {
    const dateFormat = dayjs(date).locale('cn').format('YYYY年M月D日 dddd')
    const {
      userStore: { isLogged, url },
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
        </QueueAnim>
      </main>
    )
  }),
)

export { NoteLayout }
