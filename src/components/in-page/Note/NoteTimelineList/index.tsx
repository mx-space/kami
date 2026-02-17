/**
 * 日记：左侧时间线
 */
import { clsx } from 'clsx'
import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { NoteModel } from '@mx-space/api-client'

import { useNoteCollection } from '~/atoms/collections/note'
import { ImpressionView } from '~/components/common/ImpressionView'
import { Divider } from '~/components/ui/Divider'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { MaterialSymbolsArrowCircleRightOutlineRounded } from '~/components/ui/Icons/for-note'
import { LeftToRightTransitionView } from '~/components/ui/Transition/LeftToRightTransitionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'
import { apiClient } from '~/utils/client'
import { springScrollToTop } from '~/utils/spring'

import { InnerTopicDetail } from '../NoteTopic/inner-detail'
import styles from './index.module.css'

const WAITING_SCROLL_TIME = 1000

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

const ObserveredNoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = (props) => {
  const { className, noteId } = props
  const t = useTranslations('topic')

  const note = useNoteCollection((state) => state.get(noteId), shallow)

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

  useEffect(() => {
    let isCanceled = false
    async function fetchList() {
      const scrollTop = document.documentElement.scrollTop

      if (scrollTop > 0)
        // waiting scroll to top
        await new Promise((resolve) => setTimeout(resolve, WAITING_SCROLL_TIME))

      if (isCanceled) return
      const data = await apiClient.note
        .getMiddleList(noteId, 10)
        .then(({ data }) => {
          return data
        })
      if (isCanceled) return

      setList(data)
    }
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      isCanceled = true
    }
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
            return (
              <MemoedItem
                key={item.id}
                active={isCurrent}
                title={item.title}
                nid={item.nid}
              />
            )
          })}
        </ul>
        {note?.topic && (
          <>
            {!!list?.length && <Divider className="!w-3/4" />}
            <p className="text-gray-1 flex min-w-0 flex-col overflow-hidden">
              {t('articleInColumnNote')}
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

export const MemoedItem = memo<{
  active: boolean
  title: string
  nid: number
}>((props) => {
  const { active, nid, title } = props

  return (
    <li className="flex items-center">
      <LeftToRightTransitionView in={active} as="span">
        <MaterialSymbolsArrowCircleRightOutlineRounded className="text-secondary" />
      </LeftToRightTransitionView>
      <Link
        className={clsx(active ? styles['active'] : null, styles.item)}
        href={`/notes/${nid}`}
        key={nid}
        scroll={false}
        onClick={springScrollToTop}
      >
        {title}
      </Link>
    </li>
  )
})

export const NoteTimelineList: FC<
  NoteTimelineListProps & JSX.IntrinsicElements['div']
> = memo((props) => {
  const isWiderThanLaptop = useDetectIsNarrowThanLaptop()
  if (isWiderThanLaptop) {
    return null
  }
  return <ObserveredNoteTimelineList {...props} />
})
