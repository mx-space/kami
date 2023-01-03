import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { useEffect } from 'react'

import { FloatPopover } from '@mx-space/kami-design/components/FloatPopover'
import { FluentList16Filled } from '@mx-space/kami-design/components/Icons/shared'
import { useModalStack } from '@mx-space/kami-design/components/Modal'

import type { TocProps } from '~/components/widgets/Toc'
import { useStore } from '~/store'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
)

export const MarkdownToc: FC<TocProps> = observer((props) => {
  const { appStore, actionStore } = useStore()
  const {
    isNarrowThanLaptop,
    viewport: { mobile },
  } = appStore
  const { present } = useModalStack()

  useEffect(() => {
    if (!isNarrowThanLaptop || props.headings.length == 0) {
      return
    }

    const InnerToc = () => <Toc {...props} useAsWeight />
    const id = 'toc'
    actionStore.appendActions({
      element: !mobile ? (
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
      icon: mobile ? <FluentList16Filled /> : null,
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
  }, [actionStore, isNarrowThanLaptop, mobile, present, props])
  return !isNarrowThanLaptop ? <Toc {...props} /> : null
})
