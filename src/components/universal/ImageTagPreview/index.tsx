import type { FC } from 'react'

import { FloatPopover } from '../FloatPopover'
import { IonSearch } from '../Icons/layout'

export const ImageTagPreview: FC<{ src: string; alt: string }> = (props) => {
  const { src, alt } = props
  return (
    <FloatPopover
      wrapperClassNames="inline"
      triggerComponent={() => (
        <a
          href={src}
          target="_blank"
          className="align-middle text-primary space-x-1"
        >
          <IonSearch className="!inline !align-middle relative top-[-2px]" />
          <span className="leading-[14px]">查看图片</span>
        </a>
      )}
    >
      <img
        className="max-h-[50vh] max-w-[500px] phone:max-w-[90vw] "
        src={src}
        alt={alt}
      />
    </FloatPopover>
  )
}
