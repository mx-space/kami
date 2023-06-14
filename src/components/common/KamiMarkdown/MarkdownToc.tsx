import type { FC } from 'react'
import { lazy, memo, useEffect } from 'react'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { Suspense } from '~/components/app/Suspense'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { FluentList16Filled } from '~/components/ui/Icons/shared'
import { useModalStack } from '~/components/ui/Modal'
import type { TocProps } from '~/components/widgets/Toc'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'

const Toc = lazy(() =>
  import('~/components/widgets/Toc').then((m) => ({
    default: m.Toc,
  })),
)

export const MarkdownToc: FC<TocProps> = memo((props) => {
  const { present } = useModalStack()
  const isNarrowThanLaptop = useDetectIsNarrowThanLaptop()
  const isMobile = useAppStore((state) => state.viewport.mobile)
  useEffect(() => {
    if (!isNarrowThanLaptop || props.headings.length == 0) {
      return
    }
    const actionStore = useActionStore.getState()
    const InnerToc = () => <Toc {...props} useAsWeight />
    const id = 'toc'
    actionStore.appendActions({
      element: !isMobile ? (
        <FloatPopover
          placement="left-end"
          strategy="fixed"
          wrapperClassNames="flex flex-1"
          offset={20}
          triggerComponent={() => (
            <button aria-label="toc button">
              <FluentList16Filled />
            </button>
          )}
          trigger="click"
        >
          <InnerToc />
        </FloatPopover>
      ) : undefined,
      icon: isMobile ? <FluentList16Filled /> : null,
      id,
      onClick() {
        present({
          component: <InnerToc />,

          modalProps: {
            title: 'Table of Content',
            blur: false,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionById(id)
    }
  }, [isNarrowThanLaptop, isMobile, present, props])
  return !isNarrowThanLaptop ? (
    <Suspense>
      <Toc {...props} />
    </Suspense>
  ) : null
})
