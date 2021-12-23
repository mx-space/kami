/*
 * @Author: Innei
 * @Date: 2021-08-28 10:58:02
 * @LastEditTime: 2021-08-28 11:48:20
 * @LastEditors: Innei
 * @FilePath: /web/components/NoteTimelineList/index.tsx
 * Mark: Coding with Love
 */

import clsx from 'clsx'
import { QueueAnim } from 'components/Anime'
import { NoteModel } from 'models/note'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { Rest } from 'utils'
import styles from './index.module.css'
interface NoteTimelineListProps {
  noteId: string
}

type NotePartial = Pick<NoteModel, 'id' | 'nid' | 'created' | 'title'>
export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = (props) => {
  const { className, noteId } = props
  const [list, setList] = useState<NotePartial[]>([])
  const router = useRouter()
  useEffect(() => {
    Rest('Note')
      .get<{
        data: NotePartial[]
        size: number
      }>('list/' + noteId)
      .then(({ data }) => {
        setList(data)
      })
  }, [noteId])
  return (
    <div className={clsx(className, styles['container'])}>
      <ul className={clsx(styles.list)}>
        <QueueAnim type={'alpha'}>
          {list.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  router.push('/notes/' + item.nid)
                }}
                className={clsx(
                  item.id === props.noteId ? styles['active'] : null,
                  styles.item,
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </QueueAnim>
      </ul>
    </div>
  )
}
