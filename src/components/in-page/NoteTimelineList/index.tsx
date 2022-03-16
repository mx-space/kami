/**
 * 日记: 左侧时间线
 */

import { NoteModel } from '@mx-space/api-client'
import clsx from 'clsx'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import Link from 'next/link'
import { FC, memo, useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { usePrevious } from 'react-use'
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
  const prevList = usePrevious(list)

  useEffect(() => {
    apiClient.note.getMiddleList(noteId, 10).then(({ data }) => {
      setList(data)
    })
  }, [noteId])

  return (
    <div className={clsx(className, styles['container'])}>
      <ul className={clsx(styles.list)}>
        <TransitionGroup>
          {list.map((item, i) => (
            <BottomUpTransitionView
              key={item.id}
              timeout={{
                enter: prevList?.length
                  ? 100 * Math.abs(prevList.length - i)
                  : 100 * i,
              }}
            >
              <li key={item.id}>
                <Link href={`/notes/${item.nid}`}>
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
            </BottomUpTransitionView>
          ))}
        </TransitionGroup>
      </ul>
    </div>
  )
})
