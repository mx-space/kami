/**
 * 日记: 左侧时间线
 */
import clsx from 'clsx'
import { Divider } from 'components/universal/Divider'
import { FloatPopover } from 'components/universal/FloatPopover'
import { ImpressionView } from 'components/universal/ImpressionView'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { TrackerAction } from 'constants/tracker'
import { useAnalyze } from 'hooks/use-analyze'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { usePrevious } from 'react-use'
import { useStore } from 'store'
import { apiClient } from 'utils/client'

import type { NoteModel } from '@mx-space/api-client'

import { InnerTopicDetail } from '../NoteTopic/inner-detail'
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

  const { event } = useAnalyze()

  const TopicComp = useCallback(
    () => (
      <Link
        href={`/notes/topics/${note?.topic?.slug}`}
        onClick={() =>
          event({
            action: TrackerAction.Click,
            label: `左侧时间线点击去话题页 - ${note?.topic?.name}`,
          })
        }
      >
        <a>
          <span className="flex-grow truncate">{note?.topic?.name}</span>
        </a>
      </Link>
    ),
    [note?.topic?.name, note?.topic?.slug],
  )
  return (
    <div className={clsx(className, styles['container'])}>
      <div className={clsx(styles.list)}>
        <TransitionGroup component={'ul'}>
          {list.map((item, i) => (
            <BottomUpTransitionView
              component={'li'}
              key={item.id}
              timeout={{
                enter: prevList?.length
                  ? 100 * Math.abs(prevList.length - i)
                  : 100 * i,
              }}
            >
              <Link href={`/notes/${item.nid}`} key={item.id}>
                <a
                  className={clsx(
                    item.id === props.noteId ? styles['active'] : null,
                    styles.item,
                  )}
                >
                  {item.title}
                </a>
              </Link>
            </BottomUpTransitionView>
          ))}
        </TransitionGroup>
        {note?.topic && (
          <>
            <Divider className="!w-3/4" />
            <p className="text-gray-1 flex flex-col min-w-0 overflow-hidden">
              此文章收录于专栏：
              <br />
              <FloatPopover
                placement="right"
                strategy="fixed"
                wrapperClassNames="flex flex-grow flex-shrink min-w-0"
                triggerComponent={TopicComp}
              >
                <ImpressionView
                  trackerMessage={`曝光 - 左侧时间线话题内页展开 - ${note?.topic?.name}`}
                  action={TrackerAction.Impression}
                >
                  <InnerTopicDetail topic={note?.topic} />
                </ImpressionView>
              </FloatPopover>
            </p>
          </>
        )}
      </div>
    </div>
  )
})
