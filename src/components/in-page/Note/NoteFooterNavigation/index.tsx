import { noop } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import type { FC } from 'react'

import type { NoteModel } from '@mx-space/api-client'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { springScrollToTop } from '~/utils/spring'

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
        <section
          className="mt-4 text-center relative px-6 py-4"
          data-hide-print
        >
          <div className="flex justify-between">
            {!!next && (
              <div
                tabIndex={1}
                role={'button'}
                className="hover:text-primary"
                onClick={() => {
                  router.push('/notes/[id]', `/notes/${next.nid}`)
                }}
              >
                前一篇
              </div>
            )}

            {!!prev && (
              <div
                tabIndex={1}
                role={'button'}
                className="hover:text-primary"
                onClick={() => {
                  router.push('/notes/[id]', `/notes/${prev.nid}`)
                }}
              >
                后一篇
              </div>
            )}
          </div>
          <div
            tabIndex={1}
            role={'button'}
            className="hover:text-primary absolute left-1/2 top-0 bottom-0 flex items-center -translate-x-1/2 transform"
            onClick={() => {
              const note = noteStore.get(id)

              event({
                action: TrackerAction.Click,
                label: `时间线点击 - ${note?.nid} - ${note?.title}`,
              })

              springScrollToTop()
              router.push('/timeline?type=note')
            }}
          >
            时间线
          </div>
        </section>
      )}
    </>
  )
})

export const NoteFooterActionBarForMobile: typeof NoteFooterNavigation =
  observer((props) => {
    const {
      appUIStore: { isPadOrMobile },
    } = useStore()

    if (isPadOrMobile) {
      return <NoteFooterNavigation {...props} />
    }
    return null
  })
