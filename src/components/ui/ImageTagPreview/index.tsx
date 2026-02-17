import type { FC } from 'react'

import { FloatPopover } from '~/components/ui/FloatPopover'
import { IonSearch } from '~/components/ui/Icons/layout'

export const ImageTagPreview: FC<{ src: string; alt: string }> = (props) => {
  const { src, alt } = props
  return (
    <FloatPopover
      wrapperClassNames="inline"
      triggerComponent={() => (
        <a
          href={src}
          target="_blank"
          className="text-primary space-x-1 align-middle" rel="noreferrer"
        >
          <IonSearch className="relative top-[-2px] !inline !align-middle" />
          <span className="leading-[14px]">查看图片</span>
        </a>
      )}
    >
      <img
        className="phone:max-w-[90vw] max-h-[50vh] max-w-[500px] "
        src={src}
        alt={alt}
      />
    </FloatPopover>
  )
}
