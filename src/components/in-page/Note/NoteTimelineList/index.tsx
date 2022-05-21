/**
 * 日记: 左侧时间线
 */
import clsx from 'clsx'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { usePrevious } from 'react-use'
import { useStore } from 'store'
import { apiClient } from 'utils/client'

import type { NoteModel } from '@mx-space/api-client'

import styles from './index.module.css'

interface NoteTimelineListProps {
  noteId: string
}

type NotePartial = Pick<NoteModel, 'id' | 'nid' | 'created' | 'title'>

export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = observer((props) => {
  const { className, noteId } = props

  const { noteStore } = useStore()
  const note = noteStore.get(noteId)
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
        {note?.topic && (
          <>
            <hr className="border-0 h-[0.5px] w-3/4 bg-black dark:bg-white !bg-opacity-50 my-4" />
            <p className="text-gray-2 truncate break-all">
              此文章收录于专栏：
              <br />
              {note.topic.name}
            </p>
          </>
        )}
      </ul>
    </div>
  )
})
