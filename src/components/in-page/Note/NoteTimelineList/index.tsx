/**
 * 日记: 左侧时间线
 */
import { clsx } from 'clsx'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { NoteModel } from '@mx-space/api-client'

import { ImpressionView } from '~/components/biz/ImpressionView'
import { Divider } from '~/components/universal/Divider'
import { FloatPopover } from '~/components/universal/FloatPopover'
import { MaterialSymbolsArrowCircleRightOutlineRounded } from '~/components/universal/Icons'
import { LeftRightTransitionView } from '~/components/universal/Transition/left-right'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { apiClient } from '~/utils/client'

import { InnerTopicDetail } from '../NoteTopic/inner-detail'
import styles from './index.module.css'

interface NoteTimelineListProps {
  noteId: string
}

type NotePartial = Pick<NoteModel, 'id' | 'nid' | 'created' | 'title'>

const ObserveredNoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = observer((props) => {
  const { className, noteId } = props

  const { noteStore } = useStore()
  const note = noteStore.get(noteId)
  const [list, setList] = useState<NotePartial[]>([note as any])

  useEffect(() => {
    const now = +new Date()
    apiClient.note.getMiddleList(noteId, 10).then(({ data }) => {
      const gapTime = +new Date() - now
      setTimeout(
        () => {
          setList(data)
        },
        gapTime > 500 ? 0 : gapTime,
      )
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
        <span className="flex-grow truncate">{note?.topic?.name}</span>
      </Link>
    ),
    [note?.topic?.name, note?.topic?.slug],
  )

  const [animationParent] = useAutoAnimate<HTMLUListElement>()
  return (
    <div className={clsx(className, styles['container'])} data-hide-print>
      <div className={clsx(styles.list)}>
        <ul ref={animationParent}>
          {list.map((item) => {
            const isCurrent = item.id === props.noteId
            return (
              <li key={item.id} className="flex items-center">
                <LeftRightTransitionView in={isCurrent}>
                  <MaterialSymbolsArrowCircleRightOutlineRounded className="text-pink" />
                </LeftRightTransitionView>
                <Link
                  className={clsx(
                    isCurrent ? styles['active'] : null,
                    styles.item,
                  )}
                  href={`/notes/${item.nid}`}
                  key={item.id}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
        {note?.topic && (
          <>
            {list.length && <Divider className="!w-3/4" />}
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

export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = observer((props) => {
  const {
    appUIStore: { isNarrowThanLaptop: isWiderThanLaptop },
  } = useStore()
  if (isWiderThanLaptop) {
    return null
  }
  return <ObserveredNoteTimelineList {...props} />
})
