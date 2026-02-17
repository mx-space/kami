import type { FC } from 'react'
import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import { noteCollection, useNoteCollection } from '~/atoms/collections/note'
import { Divider } from '~/components/ui/Divider'
import { useRouter } from '~/i18n/navigation'
import {
  IcRoundKeyboardDoubleArrowLeft,
  IcRoundKeyboardDoubleArrowRight,
} from '~/components/ui/Icons/arrow'
import { MdiClockTimeThreeOutline } from '~/components/ui/Icons/for-note'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'
import { springScrollToTop } from '~/utils/spring'

export const NoteFooterNavigation: FC<{ id: string }> = memo(({ id }) => {
  const t = useTranslations('note')
  const [prevNid, nextNid] = useNoteCollection<
    [number | undefined, number | undefined]
  >((state) => {
    const [prev, next] = state.relationMap.get(id) || []
    return [prev?.nid, next?.nid] as [number | undefined, number | undefined]
  }, shallow)

  const router = useRouter()
  const { event } = useAnalyze()

  const goNext = (nid: number) => {
    router.push(`/notes/${nid}`, { scroll: false })
    springScrollToTop()
  }
  return (
    <>
      {/* // 没有 0 的情况 */}
      {(!!prevNid || !!nextNid) && (
        <>
          <Divider className="!w-15 m-auto" />
          <section
            className="text-gray-1 relative mt-4 py-2 text-center"
            data-hide-print
          >
            <div className="children:inline-flex children:items-center children:space-x-2 children:px-2 children:py-2 flex items-center justify-between">
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
                    <span>{t('prev')}</span>
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
                    <span>{t('next')}</span>
                    <IcRoundKeyboardDoubleArrowRight />
                  </div>
                </>
              )}
            </div>
            <div
              tabIndex={1}
              role="button"
              className="text-pink hover:text-primary absolute bottom-0 left-1/2 top-0 flex -translate-x-1/2 transform items-center space-x-2 opacity-80"
              onClick={() => {
                const note = noteCollection.get(id)

                event({
                  action: TrackerAction.Click,
                  label: `时间线点击 - ${note?.nid} - ${note?.title}`,
                })

                springScrollToTop()
                router.push(`/timeline?type=note&id=${id}`, { scroll: false })
              }}
            >
              <span>{t('timeline')}</span>
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
