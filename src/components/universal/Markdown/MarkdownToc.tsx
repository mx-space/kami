import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { memo, useEffect } from 'react'

import { FloatPopover } from '@mx-space/kami-design/components/FloatPopover'
import { FluentList16Filled } from '@mx-space/kami-design/components/Icons/shared'
import { useModalStack } from '@mx-space/kami-design/components/Modal'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import type { TocProps } from '~/components/widgets/Toc'
import { useDetectIsNarrowThanLaptop } from '~/hooks/use-viewport'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
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
            noBlur: true,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionById(id)
    }
  }, [isNarrowThanLaptop, isMobile, present, props])
  return !isNarrowThanLaptop ? <Toc {...props} /> : null
})
