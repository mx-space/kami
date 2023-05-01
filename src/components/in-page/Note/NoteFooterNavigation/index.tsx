import { useRouter } from 'next/router'
import type { FC } from 'react'
import { memo } from 'react'
import { shallow } from 'zustand/shallow'

import { Divider } from '@mx-space/kami-design/components/Divider'
import {
  IcRoundKeyboardDoubleArrowLeft,
  IcRoundKeyboardDoubleArrowRight,
} from '@mx-space/kami-design/components/Icons/arrow'
import { MdiClockTimeThreeOutline } from '@mx-space/kami-design/components/Icons/for-note'

import { noteCollection, useNoteCollection } from '~/atoms/collections/note'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useDetectIsNarrowThanLaptop } from '~/hooks/use-viewport'
import { springScrollToTop } from '~/utils/spring'

export const NoteFooterNavigation: FC<{ id: string }> = memo(({ id }) => {
  const [prevNid, nextNid] = useNoteCollection<
    [number | undefined, number | undefined]
  >((state) => {
    const [prev, next] = state.relationMap.get(id) || []
    return [prev?.nid, next?.nid] as [number | undefined, number | undefined]
  }, shallow)

  const router = useRouter()
  const { event } = useAnalyze()

  const goNext = (nid: number) => {
    router.push('/notes/[id]', `/notes/${nid}`, { scroll: false })
    springScrollToTop()
  }
  return (
    <>
      {/* // 没有 0 的情况 */}
      {(!!prevNid || !!nextNid) && (
        <>
          <Divider className="!w-15 m-auto" />
          <section
            className="mt-4 text-center relative text-gray-1 py-2"
            data-hide-print
          >
            <div className="flex justify-between items-center children:inline-flex children:items-center children:space-x-2 children:px-2 children:py-2">
              {!!nextNid && (
                <>
                  <div
                    tabIndex={1}
                    role="button"
                    className="hover:text-primary"
                    onClick={() => {
                      goNext(nextNid)
                    }}
                  >
                    <IcRoundKeyboardDoubleArrowLeft />
                    <span>前一篇</span>
                  </div>
                </>
              )}

              {!!prevNid && (
                <>
                  <div
                    tabIndex={1}
                    role="button"
                    className="hover:text-primary"
                    onClick={() => {
                      goNext(prevNid)
                    }}
                  >
                    <span>后一篇</span>
                    <IcRoundKeyboardDoubleArrowRight />
                  </div>
                </>
              )}
            </div>
            <div
              tabIndex={1}
              role="button"
              className="opacity-80 text-pink hover:text-primary absolute left-1/2 top-0 bottom-0 flex items-center -translate-x-1/2 transform space-x-2"
              onClick={() => {
                const note = noteCollection.get(id)

                event({
                  action: TrackerAction.Click,
                  label: `时间线点击 - ${note?.nid} - ${note?.title}`,
                })

                springScrollToTop()
                router.push(`/timeline?type=note&id=${id}`)
              }}
            >
              <span>时间线</span>
              <MdiClockTimeThreeOutline />
            </div>
          </section>
        </>
      )}
    </>
  )
})

export const NoteFooterNavigationBarForMobile: typeof NoteFooterNavigation = (
  props,
) => {
  const isWiderThanLaptop = useDetectIsNarrowThanLaptop()

  if (isWiderThanLaptop) {
    return <NoteFooterNavigation {...props} />
  }
  return null
}
