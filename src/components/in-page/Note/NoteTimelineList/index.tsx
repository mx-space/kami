/**
 * 日记：左侧时间线
 */

import { clsx } from 'clsx'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { NoteModel } from '@mx-space/api-client'
import { Divider } from '@mx-space/kami-design/components/Divider'
import { FloatPopover } from '@mx-space/kami-design/components/FloatPopover'
import { MaterialSymbolsArrowCircleRightOutlineRounded } from '@mx-space/kami-design/components/Icons/for-note'
import { LeftRightTransitionView } from '@mx-space/kami-design/components/Transition/left-right'

import { useNoteCollection } from '~/atoms/collections/note'
import { ImpressionView } from '~/components/biz/ImpressionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useIsUnMounted } from '~/hooks/use-is-unmounted'
import { useDetectIsNarrowThanLaptop } from '~/hooks/use-viewport'
import { apiClient } from '~/utils/client'
import { springScrollToTop } from '~/utils/spring'

import { InnerTopicDetail } from '../NoteTopic/inner-detail'
import styles from './index.module.css'

interface NoteTimelineListProps {
  noteId: string
}

const TopicComp: FC<{
  note: NoteModel
}> = ({ note }) => {
  const { event } = useAnalyze()

  return (
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
  )
}

type NotePartial = Pick<NoteModel, 'id' | 'nid' | 'created' | 'title'>

const ObserveredNoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = (props) => {
  const { className, noteId } = props

  const note = useNoteCollection((state) => state.get(noteId))

  const [list, setList] = useState(() => {
    if (!note) return []
    return [
      {
        created: note.created,
        id: note.id,
        nid: note.nid,
        title: note.title,
      },
    ]
  })

  const isUnmount = useIsUnMounted()
  useEffect(() => {
    async function fetchList() {
      const scrollTop = document.documentElement.scrollTop

      if (scrollTop > 0)
        // waiting scroll to top
        await new Promise((resolve) => setTimeout(resolve, 350))

      if (isUnmount.current) return
      const data = await apiClient.note
        .getMiddleList(noteId, 10)
        .then(({ data }) => {
          return data
        })
      if (isUnmount.current) return

      setList(data)
    }
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  const triggerComponent = useMemo(
    () => () => <TopicComp note={note!} />,
    [note],
  )

  const [animationParent] = useAutoAnimate<HTMLUListElement>()

  return (
    <div className={clsx(styles['container'], className)} data-hide-print>
      <div className={clsx(styles.list)}>
        <ul ref={animationParent}>
          {list?.map((item) => {
            const isCurrent = item.id === noteId
            return <MemoedItem key={item.id} item={item} active={isCurrent} />
          })}
        </ul>
        {note?.topic && (
          <>
            {!!list?.length && <Divider className="!w-3/4" />}
            <p className="text-gray-1 flex flex-col min-w-0 overflow-hidden">
              此文章收录于专栏：
              <br />
              <FloatPopover
                placement="right"
                strategy="fixed"
                wrapperClassNames="flex flex-grow flex-shrink min-w-0"
                triggerComponent={triggerComponent}
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
}
const scrollToTop = () => {
  springScrollToTop(250)
}
export const MemoedItem = memo<{
  active: boolean
  item: NotePartial
}>(
  (props) => {
    const { active, item } = props

    return (
      <li className="flex items-center">
        <LeftRightTransitionView in={active}>
          <MaterialSymbolsArrowCircleRightOutlineRounded className="text-pink" />
        </LeftRightTransitionView>
        <Link
          className={clsx(active ? styles['active'] : null, styles.item)}
          href={`/notes/${item.nid}`}
          key={item.id}
          scroll={false}
          onClick={scrollToTop}
        >
          {item.title}
        </Link>
      </li>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.active === nextProps.active &&
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.nid === nextProps.item.nid
    )
  },
)

export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = observer((props) => {
  const isWiderThanLaptop = useDetectIsNarrowThanLaptop()
  if (isWiderThanLaptop) {
    return null
  }
  return <ObserveredNoteTimelineList {...props} />
})
