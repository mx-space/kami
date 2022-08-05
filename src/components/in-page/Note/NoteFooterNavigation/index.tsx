import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import type { FC } from 'react'

import type { NoteModel } from '@mx-space/api-client'

import { Divider } from '~/components/universal/Divider'
import { MdiClockTimeThreeOutline } from '~/components/universal/Icons/for-note'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { springScrollToTop } from '~/utils/spring'
import { noop } from '~/utils/utils'

import {
  IcRoundKeyboardDoubleArrowLeft,
  IcRoundKeyboardDoubleArrowRight,
} from '../../../universal/Icons/arrow'

export const NoteFooterNavigation: FC<{ id: string }> = observer(({ id }) => {
  const { noteStore } = useStore()
  const [prev, next] =
    noteStore.relationMap.get(id) ||
    ([noop, noop] as [Partial<NoteModel>, Partial<NoteModel>])
  const router = useRouter()
  const { event } = useAnalyze()
  return (
    <>
      {(!!next || !!prev) && (
        <>
          <Divider className="!w-15 m-auto" />
          <section
            className="mt-4 text-center relative text-gray-1 py-2"
            data-hide-print
          >
            <div className="flex justify-between items-center children:inline-flex children:items-center children:space-x-2 children:px-2 children:py-2">
              {!!next && (
                <>
                  <div
                    tabIndex={1}
                    role={'button'}
                    className="hover:text-primary"
                    onClick={() => {
                      router.push('/notes/[id]', `/notes/${next.nid}`)
                    }}
                  >
                    <IcRoundKeyboardDoubleArrowLeft />
                    <span>前一篇</span>
                  </div>
                </>
              )}

              {!!prev && (
                <>
                  <div
                    tabIndex={1}
                    role={'button'}
                    className="hover:text-primary"
                    onClick={() => {
                      router.push('/notes/[id]', `/notes/${prev.nid}`)
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
              role={'button'}
              className="opacity-80 text-pink hover:text-primary absolute left-1/2 top-0 bottom-0 flex items-center -translate-x-1/2 transform space-x-2"
              onClick={() => {
                const note = noteStore.get(id)

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

export const NoteFooterNavigationBarForMobile: typeof NoteFooterNavigation =
  observer((props) => {
    const {
      appUIStore: { isNarrowThanLaptop: isWiderThanLaptop },
    } = useStore()

    if (isWiderThanLaptop) {
      return <NoteFooterNavigation {...props} />
    }
    return null
  })
