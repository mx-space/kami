/**
 * 日记: 左侧时间线
 */

import { NoteModel } from '@mx-space/api-client'
import clsx from 'clsx'
import { QueueAnim } from 'components/universal/Anime'
import Link from 'next/link'
import { FC, memo, useEffect, useState } from 'react'
import { apiClient } from 'utils/client'
import styles from './index.module.css'

interface NoteTimelineListProps {
  noteId: string
}

type NotePartial = Pick<NoteModel, 'id' | 'nid' | 'created' | 'title'>
export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = memo((props) => {
  const { className, noteId } = props
  const [list, setList] = useState<NotePartial[]>([])

  useEffect(() => {
    apiClient.note.getMiddleList(noteId, 10).then(({ data }) => {
      setList(data)
    })
  }, [noteId])

  return (
    <div className={clsx(className, styles['container'])}>
      <ul className={clsx(styles.list)}>
        <QueueAnim type={['bottom', 'alpha']}>
          {list.map((item) => (
            <li key={item.id}>
              <Link href={'/notes/' + item.nid}>
                <a
                  className={clsx(
                    item.id === props.noteId ? styles['active'] : null,
                    styles.item,
                  )}
                >
                  {item.title}
                </a>
              </Link>
            </li>
          ))}
        </QueueAnim>
      </ul>
    </div>
  )
})
